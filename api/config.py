import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Config(BaseSettings):
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    CHAT_MODEL: str = "gpt-4o"
    MAX_TOKENS: int = 4000
    TEMPERATURE: float = 0.7
    COLLECTION_NAME: str = "choir"
    SEARCH_LIMIT: int = 80
    CHUNK_SIZE: int = 10000
    CHUNK_OVERLAP: int = 5000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
