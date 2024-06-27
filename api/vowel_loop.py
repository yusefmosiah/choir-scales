from openai import OpenAI
from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import ApiException, UnexpectedResponse
from datetime import datetime
import logging
import uuid
import os
import asyncio
from fastapi import WebSocket

from dotenv import load_dotenv

load_dotenv()

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
qdrant_client = QdrantClient(url=os.environ.get("QDRANT_URL"), api_key=os.environ.get("QDRANT_API_KEY"))

def embed(input_text, model_name="text-embedding-ada-002", chunk_size=10000, overlap=5000):
    chunks = []
    start = 0
    while start < len(input_text):
        end = min(start + chunk_size, len(input_text))
        chunks.append(input_text[start:end])
        start += chunk_size - overlap

    embeddings = []
    for chunk in chunks:
        embedding_response = openai_client.embeddings.create(
            input=chunk,
            model=model_name
        )
        embeddings.append(embedding_response.data[0].embedding)

    return embeddings

def search(embeddings, collection_name="choir", search_limit=40):
    search_results = []
    for embedding in embeddings:
        results = qdrant_client.search(
            collection_name=collection_name,
            query_vector=embedding,
            limit=search_limit
        )
        search_results.extend(results)

    return search_results

def deduplicate(search_results):
    unique_payloads = set()
    deduplicated_results = []
    for result in search_results:
        payload_content = result.payload.get('content', None)
        if payload_content and payload_content not in unique_payloads:
            unique_payloads.add(payload_content)
            deduplicated_results.append(result)

    print(f"Deduplicated {len(search_results)} search results to {len(deduplicated_results)} unique results: {deduplicated_results}")
    return deduplicated_results

async def chat_completion(messages, model="gpt-4o", max_tokens=4000, n=1, stop=None, temperature=0.7):
    response = openai_client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        n=n,
        stop=stop,
        temperature=temperature
    )
    return response.choices[0].message.content

def upsert(id, input_string, embedding, collection_name="choir"):
        try:
            qdrant_client.upsert(
                collection_name=collection_name,
                points=[
                    models.PointStruct(
                        id=id,
                        payload={"content": input_string, "created_at": datetime.now(), "agent": "vowel_loop_v0"},
                        vector=embedding,
                    )
                ],
            )
            print(f"Successfully upserted observation with ID: {id}, content: {input_string}")
        except (ApiException, UnexpectedResponse) as e:
            logging.error(f"Error during upsert operation: {e}")
            # Handle the error as needed

def save_observation(observation):
    try:
        embedding = embed(observation)
        observation_id = str(uuid.uuid4())  # Generate a unique ID for the observation

        upsert(
            id=observation_id,
            input_string=observation,
            embedding=embedding
        )

    except Exception as e:
        logging.error(f"Error during save_observation: {e}")
        # Handle the error as needed

async def action(messages, user_prompt):
    action_system_prompt = """
    This is the Vowel Loop, a decision-making model that turns the OODA loop on its head. Rather than accumulating data before acting, you act with "beginners mind"/emptiness, then reflect on your "System 1" action.
    A user has asked you to engage in the Vowel Loop reasoning process.
    This is step 1, Action: Provide an initial response to the user's prompt to the best of your ability.
    """

    messages.append({"role": "system", "content": action_system_prompt})
    messages.append({"role": "user", "content": user_prompt})
    completion = await chat_completion(messages)
    print(f"Action: {completion}")
    return completion

async def experience(messages):
    experience_system_prompt = """This is step 2 of the Vowel Loop, Experience: Search your memory for relevant context that could help refine the response from step 1."""

    prompt = messages[-1]["content"]
    embedding = embed(prompt)
    search_results = search(embedding)
    deduplicated_results = deduplicate(search_results)

    # Create a string of search results
    search_results_str = "\n".join([r.payload['content'] for r in deduplicated_results])

    reranked_prompt = f"{prompt}\n\nSearch Results:\n{search_results_str}\n\nReranked Search Results:"
    messages.append({"role": "system", "content": experience_system_prompt})
    messages.append({"role": "user", "content": reranked_prompt})
    completion = await chat_completion(messages)
    print(f"Experience: {completion}")

    # Combine search results and completion
    combined_result = f"Search Results:\n{search_results_str}\n\nGenerated Response:\n{completion}"
    return combined_result

async def intention(messages):
    intention_system_prompt = """
    This is step 3 of the Vowel Loop, Intention: Impute the user's intention, reflecting on whether the query can be satisfactorily responded to based on the priors recalled in the Experience step
    """

    intention_prompt = f"{messages[-1]['content']}\n\nReflection on goal satisfiability:"
    messages.append({"role": "system", "content": intention_system_prompt})
    messages.append({"role": "user", "content": intention_prompt})
    completion = await chat_completion(messages)
    print(f"Intention: {completion}")
    return completion

async def observation(messages):
    observation_system_prompt = """This is step 4 of the Vowel Loop, Observation: Note any key insights from this iteration that could help improve future responses.
    This note will be saved to a global vector database accessible to all instances of this AI Agent, for all users.
    Don't save any private information."""

    observation_prompt = f"{messages[-1]['content']}\n\nNote for future recall:"
    messages.append({"role": "system", "content": observation_system_prompt})
    messages.append({"role": "user", "content": observation_prompt})
    completion = await chat_completion(messages)
    print(f"Observation: {completion}")
    return completion

async def update(messages):
    update_system_prompt = """This is step 5 of the Vowel Loop, Update: Decide whether to perform another round of the loop to further refine the response or to provide a final answer to the user. Respond with 'LOOP' or 'RETURN'."""

    update_prompt = f"{messages[-1]['content']}\n\nShould we LOOP or RETURN final response?"
    messages.append({"role": "system", "content": update_system_prompt})
    messages.append({"role": "user", "content": update_prompt})

    completion = await chat_completion(messages, max_tokens=1)
    print(f"Update: {completion}")

    observation_result = messages[-2]["content"].replace("Observation: ", "")
    save_observation(observation_result)

    if completion and completion.lower() == "return":
        return "return"
    elif completion and completion.lower() == "loop":
        print("Looping...\n")
        return "loop"
    else:
        print("Invalid update response. Please try again.")
        return "invalid"

async def yield_response(messages):
    yield_system_prompt = """This is the final step of the Vowel Loop, Yield: Synthesize the accumulated context from all iterations and provide a final response that comprehensively addresses the user's original prompt."""
    messages.append({"role": "system", "content": yield_system_prompt})
    messages.append({"role": "user", "content": "Synthesize the accumulated context and provide a final response:"})
    final_response = await chat_completion(messages)
    print(f"Final Response: {final_response}")
    return final_response

async def vowel_loop(user_prompt, websocket: WebSocket):
    print("XXXXXX")
    messages = [{"role": "user", "content": user_prompt}]
    for step_function in [action, experience, intention, observation, update]:
        if step_function == action:
            result = await step_function(messages, user_prompt)  # Pass user_prompt only to action
            print(f"Action: {result}")
        else:
            result = await step_function(messages)
            print(f"{step_function.__name__.capitalize()}: {result}")
        messages.append({"role": "assistant", "content": f"{step_function.__name__.capitalize()}: {result}"})
        await websocket.send_json({"step": step_function.__name__, "content": result})

        if step_function == update:
            if result.lower() == "return":
                final_response = await yield_response(messages)
                await websocket.send_json({"step": "final", "content": final_response})
                return  # Exit after sending final response
            elif result.lower() == "loop":
                print("Looping...")
                return await vowel_loop(user_prompt, websocket)  # Recursive call to restart the loop

    # If loop exits without "return" or "loop", handle unexpected exit here
    print("Unexpected exit from the Vowel Loop.")
    await websocket.send_json({"error": "Unexpected exit from the Vowel Loop."})
