import logging
from litellm import completion, embedding
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def get_embedding(input_text: str, model: str) -> List[float]:
    try:
        embedding_response = embedding(
            input=input_text,
            model=model
        )
        return embedding_response.data[0]['embedding']
    except Exception as e:
        logger.error(f"Error getting embedding: {e}")
        return []

async def chat_completion(messages: List[Dict[str, str]], model: str, max_tokens: int, temperature: float) -> str:
    try:
        response = completion(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error during chat completion: {e}")
        return ""

def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks
