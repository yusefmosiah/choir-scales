from openai import OpenAI
import os
import asyncio

from litellm import completion

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def stream_chat_completion(messages, model="gpt-4o", max_tokens=4000, n=1, stop=None, temperature=0.7):
    response = openai_client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        n=n,
        stop=stop,
        temperature=temperature,
        stream=True
    )
    async for chunk in response:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content


async def lite_completion(messages, model="gpt-4o"):
    response = completion(
    model = model,
    messages = messages,
    stream=True
    )
    print("OpenAI Streaming response")
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content)
            yield chunk.choices[0].delta.content
