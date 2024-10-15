import asyncio
from enum import Enum
from typing import List, Dict, Any, Optional
from starlette.websockets import WebSocket, WebSocketState
from config import Config
from database import DatabaseClient
from models import Message, ChorusState, ChorusStepEnum, ChorusResponse, Source
from utils import logger, get_embedding, chat_completion, chunk_text
from litellm import completion
from pydantic import BaseModel
import json
import uuid
from datetime import datetime

class Chorus:
    def __init__(self, config: Config, db_client: DatabaseClient):
        self.config = config
        self.db_client = db_client
        self.state = ChorusState()

    async def run(self, user_prompt: str, websocket: WebSocket, chat_history: List[Dict[str, str]], thread_id: str) -> List[Dict[str, str]]:
        self.state.reset()
        self.state.messages = chat_history + [{"role": "user", "content": user_prompt}]
        self.state.thread_id = thread_id  # Assign the current thread ID

        try:
            for step_function in [self._action, self._experience, self._intention, self._observation, self._update]:
                if websocket.client_state != WebSocketState.CONNECTED:
                    logger.warning("WebSocket disconnected. Stopping Chorus loop.")
                    break
                result = await step_function()
                await self._send_result(websocket, result)
                await asyncio.sleep(0.1)  # Prevent steps from bunching together

                if step_function == self._update:
                    if result.content.lower() == "return":
                        final_response = await self._yield()
                        await self._send_result(websocket, final_response)
                        await asyncio.sleep(0.1)
                        self.state.complete()
                    elif result.content.lower() == "loop":
                        self.state.loop()
                    else:
                        logger.error(f"Unexpected result from update step: {result.content}")
                        final_response = await self._yield()
                        await self._send_result(websocket, final_response)
                        await asyncio.sleep(0.1)
                        self.state.complete()
        except Exception as e:
            logger.error(f"Error in Chorus run: {str(e)}")
            if websocket.client_state == WebSocketState.CONNECTED:
                error_response = ChorusResponse(step=ChorusStepEnum.ERROR, content=f"An error occurred: {str(e)}")
                await self._send_result(websocket, error_response)

        # Save final chat history to Qdrant
        logger.info(f"Saving final chat history to Qdrant: {self.state.messages}")
        for message in self.state.messages:
            if message.get('role') and message.get('content'):
                await self._commit_message(message['role'], message['content'])

        return self.state.messages

    async def _commit_message(self, role: str, content: str, embedding: Optional[List[float]] = None):
        if embedding is None:
            embedding = await get_embedding(content, self.config.EMBEDDING_MODEL)

        if not embedding:
            logger.error("Failed to generate embedding for the message.")
            return

        message = Message(
            id=str(uuid.uuid4()),
            thread_id=self.state.thread_id,  # This is already correct
            role=role,
            content=content,
            created_at=datetime.utcnow().isoformat(),
            vector=embedding
        )
        await self.db_client.save_message(message)

    async def _execute_step(self, step: ChorusStepEnum) -> str:
        step_function = getattr(self, f"_{step.value}")
        return await step_function()

    async def _send_result(self, websocket: WebSocket, response: ChorusResponse):
        if websocket.client_state == WebSocketState.CONNECTED:
            try:
                response_data = json.loads(response.to_json())
                response_data['isStreaming'] = self.state.current_step != ChorusStepEnum.FINAL
                await websocket.send_json(response_data)
                logger.info(f"Sent {response.step} result to client.")
            except Exception as e:
                logger.error(f"Error sending result to client: {e}")
        else:
            logger.warning("WebSocket is not connected. Skipping message send.")

    async def _handle_interrupt(self, websocket: WebSocket):
        await websocket.send_json({"status": "interrupted"})
        self.state.clear_interrupt()

    def _get_next_step(self) -> ChorusStepEnum:
        return ChorusStepEnum(self.state.current_step)

    async def _action(self) -> ChorusResponse:
        action_prompt = """
        This is the Chorus Loop, a decision-making model that turns the OODA loop on its head.
        Rather than accumulating data before acting, you act with "beginner's mind"/emptiness,
        then reflect on your "System 1" action.
        This is step 1, Action: Provide an initial response to the user's prompt to the best of your ability.
        Return your response.
        """
        self.state.messages.append({"role": "system", "content": action_prompt})
        result = await self._structured_chat_completion(self.state.messages)
        logger.info(f"Action step result: {result}")
        self.state.messages.append({"role": "assistant", "content": result.content})
        return ChorusResponse(step=ChorusStepEnum.ACTION, content=result.content)

    async def _experience(self) -> ChorusResponse:
        experience_prompt = """
        This is step 2 of the Chorus Loop, Experience: Search your memory for relevant context that could help refine the response from step 1.
        Return your response containing your refined response.
        """
        prompt = self.state.messages[-1]["content"]
        embedding = await get_embedding(prompt, self.config.EMBEDDING_MODEL)
        search_results = await self.db_client.search(embedding)
        search_results_str = "\n".join([result['content'] for result in search_results])

        # Convert search_results to list of Source instances
        sources = []
        for result in search_results:
            sources.append(
                Source(
                    id=result['id'],
                    content=result['content'],
                    created_at=result.get('created_at'),  # Pass raw value
                    agent=result.get('agent'),
                    token_value=result.get('token_value', 0),
                    similarity=result.get('similarity', 0.0)
                )
            )

        # Log the first 10 search results
        for i, result in enumerate(search_results[:10], 1):
            logger.info(f"Search result {i}: {result['content'][:100]}...")  # Log first 100 characters of each result

        reranked_prompt = f"{prompt}\n\nSearch Results:\n{search_results_str}\n\nRefined Response:"

        self.state.messages.append({"role": "system", "content": experience_prompt})
        self.state.messages.append({"role": "user", "content": reranked_prompt})
        result = await self._structured_chat_completion(self.state.messages)

        # Ensure sources are included
        self.state.messages.append({"role": "assistant", "content": result.content})
        return ChorusResponse(step=ChorusStepEnum.EXPERIENCE, content=result.content, sources=sources)

    async def _intention(self) -> ChorusResponse:
        intention_prompt = """
        This is step 3 of the Chorus Loop, Intention: Impute the user's intention,
        reflecting on whether the query can be satisfactorily responded to based on
        the priors recalled in the Experience step.
        Return your response containing your reflection.
        """
        intention_message = f"{self.state.messages[-1]['content']}\n\nReflection on goal satisfiability:"
        self.state.messages.append({"role": "system", "content": intention_prompt})
        self.state.messages.append({"role": "user", "content": intention_message})
        result = await self._structured_chat_completion(self.state.messages)
        self.state.messages.append({"role": "assistant", "content": result.content})
        return ChorusResponse(step=ChorusStepEnum.INTENTION, content=result.content)

    async def _observation(self) -> ChorusResponse:
        observation_prompt = """
        This is step 4 of the Chorus Loop, Observation: Note key insights from the iteration.
        Return your response containing your key insights.
        """
        observation_message = f"{self.state.messages[-1]['content']}\n\nKey Insights:"
        self.state.messages.append({"role": "system", "content": observation_prompt})
        self.state.messages.append({"role": "user", "content": observation_message})
        result = await self._structured_chat_completion(self.state.messages)

        # Ensure the content is a string
        if isinstance(result.content, dict) and 'key_insights' in result.content:
            content = "\n".join(result.content['key_insights'])
        else:
            content = str(result.content)

        self.state.messages.append({"role": "assistant", "content": content})
        return ChorusResponse(step=ChorusStepEnum.OBSERVATION, content=content)

    async def _update(self) -> ChorusResponse:
        update_prompt = """
        This is step 5 of the Chorus Loop, Update: Decide whether to loop or finalize the response.
        Return your decision as a JSON object with 'step' set to 'update' and 'content' containing either 'LOOP' or 'RETURN'.
        """
        self.state.messages.append({"role": "system", "content": update_prompt})
        self.state.messages.append({"role": "user", "content": "Make your decision (LOOP or RETURN):"})
        result = await self._structured_chat_completion(self.state.messages)
        self.state.messages.append({"role": "assistant", "content": result.content})
        return ChorusResponse(step=ChorusStepEnum.UPDATE, content=result.content)

    async def _yield(self) -> ChorusResponse:
        yield_prompt = """
        This is the final step of the Chorus Loop, Yield: Synthesize the accumulated context
        from all iterations and provide a final response that comprehensively addresses
        the user's original prompt. Return your response containing your synthesized response.
        """
        self.state.messages.append({"role": "system", "content": yield_prompt})
        self.state.messages.append({"role": "user", "content": "Write a final response to the user's prompt:"})
        result = await self._structured_chat_completion(self.state.messages)
        logger.info(f"Yield step result: {result}")
        self.state.messages.append({"role": "assistant", "content": result.content})
        return ChorusResponse(step=ChorusStepEnum.FINAL, content=result.content)

    async def _structured_chat_completion(self, messages: List[Dict[str, str]], response_format: BaseModel = None) -> ChorusResponse:
        try:
            response = completion(
                model=self.config.CHAT_MODEL,
                messages=messages,
                max_tokens=self.config.MAX_TOKENS,
                temperature=self.config.TEMPERATURE
            )
            content = response.choices[0].message.content
            try:
                parsed_content = json.loads(content)
                if isinstance(parsed_content, dict) and 'content' in parsed_content:
                    content = parsed_content['content']
            except json.JSONDecodeError:
                pass  # Content is not JSON, use as is
            return ChorusResponse(step=self.state.current_step.value, content=content)
        except Exception as e:
            logger.error(f"Error in structured chat completion: {str(e)}")
            return ChorusResponse(step=ChorusStepEnum.ERROR.value, content=f"An error occurred: {str(e)}")
