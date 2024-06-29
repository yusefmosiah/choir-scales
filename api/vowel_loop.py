import asyncio
from enum import Enum
from typing import List, Dict, Any
from starlette.websockets import WebSocket, WebSocketState
from config import Config
from database import DatabaseClient
from models import Message, VowelLoopState
from utils import logger, get_embedding, chat_completion, chunk_text

class VowelLoopStep(Enum):
    ACTION = "action"
    EXPERIENCE = "experience"
    INTENTION = "intention"
    OBSERVATION = "observation"
    UPDATE = "update"
    YIELD = "yield"

class VowelLoop:
    def __init__(self, config: Config, db_client: DatabaseClient):
        self.config = config
        self.db_client = db_client
        self.state = VowelLoopState()

    async def run(self, user_prompt: str, websocket: WebSocket, chat_history: List[Dict[str, str]]) -> List[Dict[str, str]]:
        self.state.reset()
        self.state.messages = chat_history + [{"role": "user", "content": user_prompt}]

        for step_function in [self._action, self._experience, self._intention, self._observation, self._update]:
            result = await step_function()
            await self._send_result(websocket, step_function.__name__.replace("_", ""), result)
            await asyncio.sleep(0.1)  # needed else steps bunch together

            if step_function == self._update:
                if result == "return" or result == "error":
                    final_response = await self._yield()
                    await self._send_result(websocket, "final", final_response)
                    await asyncio.sleep(0.1)  # needed else steps bunch together
                    self.state.complete()
                elif result == "loop":
                    self.state.loop()
                else:
                    logger.error(f"Unexpected result from update step: {result}")
                    final_response = await self._yield()
                    await self._send_result(websocket, "final", final_response)
                    await asyncio.sleep(0.1)
                    self.state.complete()

        return self.state.messages

    async def _execute_step(self, step: VowelLoopStep) -> str:
        step_function = getattr(self, f"_{step.value}")
        return await step_function()

    async def _send_result(self, websocket: WebSocket, step: str, content: str):
        if websocket.client_state == WebSocketState.CONNECTED:
            await websocket.send_json({"step": step, "content": content})
            logger.info(f"Sent {step} result to client.")
        else:
            logger.warning("WebSocket is not connected.")

    async def _handle_interrupt(self, websocket: WebSocket):
        await websocket.send_json({"status": "interrupted"})
        self.state.clear_interrupt()

    def _get_next_step(self) -> VowelLoopStep:
        return VowelLoopStep(self.state.current_step)

    async def _action(self) -> str:
        action_prompt = """
        This is the Vowel Loop, a decision-making model that turns the OODA loop on its head.
        Rather than accumulating data before acting, you act with "beginners mind"/emptiness,
        then reflect on your "System 1" action.
        This is step 1, Action: Provide an initial response to the user's prompt to the best of your ability.
        """
        self.state.messages.append({"role": "system", "content": action_prompt})
        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE)
        self.state.messages.append({"role": "assistant", "content": result})
        return result

    async def _experience(self) -> str:
        experience_prompt = "This is step 2 of the Vowel Loop, Experience: Search your memory for relevant context that could help refine the response from step 1."
        prompt = self.state.messages[-1]["content"]
        embedding = await get_embedding(prompt, self.config.EMBEDDING_MODEL)
        search_results = await self.db_client.search(embedding)

        search_results_str = "\n".join([r['payload']['content'] for r in search_results])
        reranked_prompt = f"{prompt}\n\nSearch Results:\n{search_results_str}\n\nReranked Search Results:"

        self.state.messages.append({"role": "system", "content": experience_prompt})
        self.state.messages.append({"role": "user", "content": reranked_prompt})
        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE)
        self.state.messages.append({"role": "assistant", "content": result})
        return f"Search Results:\n{search_results_str}\n\nGenerated Response:\n{result}"

    async def _intention(self) -> str:
        intention_prompt = """
        This is step 3 of the Vowel Loop, Intention: Impute the user's intention,
        reflecting on whether the query can be satisfactorily responded to based on
        the priors recalled in the Experience step
        """
        intention_message = f"{self.state.messages[-1]['content']}\n\nReflection on goal satisfiability:"
        self.state.messages.append({"role": "system", "content": intention_prompt})
        self.state.messages.append({"role": "user", "content": intention_message})
        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE)
        self.state.messages.append({"role": "assistant", "content": result})
        return result

    async def _observation(self) -> str:
        observation_prompt = """
        This is step 4 of the Vowel Loop, Observation: Note any key insights from this iteration
        that could help improve future responses. This note will be saved to a global vector
        database accessible to all instances of this AI Agent, for all users.
        Don't save any private information.
        """
        observation_message = f"{self.state.messages[-1]['content']}\n\nNote for future recall:"
        self.state.messages.append({"role": "system", "content": observation_prompt})
        self.state.messages.append({"role": "user", "content": observation_message})
        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE)
        self.state.messages.append({"role": "assistant", "content": result})

        # Save observation to database
        embedding = await get_embedding(result, self.config.EMBEDDING_MODEL)
        await self.db_client.upsert(result, embedding)

        return result

    async def _update(self) -> str:
        update_prompt = """
        This is step 5 of the Vowel Loop, Update: Decide whether to perform another round
        of the loop to further refine the response or to provide a final answer to the user.
        Respond with 'LOOP' or 'RETURN'.
        """
        update_message = f"{self.state.messages[-1]['content']}\n\nShould we LOOP or RETURN final response?"
        self.state.messages.append({"role": "system", "content": update_prompt})
        self.state.messages.append({"role": "user", "content": update_message})

        functions = [
            {
                "name": "update_function",
                "description": "Decide whether to loop or return the final response",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "decision": {
                            "type": "string",
                            "enum": ["LOOP", "RETURN"]
                        }
                    },
                    "required": ["decision"]
                }
            }
        ]

        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE, functions)
        self.state.messages.append({"role": "assistant", "content": result})

        if result.lower() in ["loop", "return"]:
            return result.lower()
        else:
            logger.error(f"Unexpected result from chat completion: {result}")
            return "error"

    async def _yield(self) -> str:
        yield_prompt = """
        This is the final step of the Vowel Loop, Yield: Synthesize the accumulated context
        from all iterations and provide a final response that comprehensively addresses
        the user's original prompt.
        """
        self.state.messages.append({"role": "system", "content": yield_prompt})
        self.state.messages.append({"role": "user", "content": "Synthesize the accumulated context and provide a final response:"})

        functions = [
            {
                "name": "yield_function",
                "description": "Synthesize the accumulated context and provide a final response",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "final_response": {
                            "type": "string"
                        }
                    },
                    "required": ["final_response"]
                }
            }
        ]

        result = await chat_completion(self.state.messages, self.config.CHAT_MODEL, self.config.MAX_TOKENS, self.config.TEMPERATURE, functions)
        self.state.messages.append({"role": "assistant", "content": result})
        return result

    async def update_function(self, decision: str) -> str:
        if decision.lower() == "loop":
            self.state.loop()
            return "LOOP"
        elif decision.lower() == "return":
            self.state.complete()
            return "RETURN"
        else:
            return "Invalid decision"

    async def yield_function(self, final_response: str) -> str:
        return final_response
