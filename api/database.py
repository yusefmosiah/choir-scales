from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import ApiException, UnexpectedResponse
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from config import Config
from utils import logger
import json
from models import User, ChatThread, Message

class DatabaseClient:
    def __init__(self, config: Config):
        self.config = config
        self.client = QdrantClient(url=config.QDRANT_URL, api_key=config.QDRANT_API_KEY)

    def generate_unique_id(self) -> str:
        return str(uuid.uuid4())

    def deduplicate_search_results(self, search_results: List[Dict[str, Any]]) -> List[str]:
        unique_contents = set()
        deduplicated_results = []
        for result in search_results:
            content = result['payload'].get('content', None)
            if content and content not in unique_contents:
                unique_contents.add(content)
                deduplicated_results.append(content)

        logger.info(f"Deduplicated {len(search_results)} search results to {len(deduplicated_results)} unique results")
        return deduplicated_results

    async def search(self, embedding: List[float]) -> List[Dict[str, Any]]:
        try:
            results = self.client.search(
                collection_name=self.config.MESSAGES_COLLECTION,
                query_vector=embedding,
                limit=self.config.SEARCH_LIMIT
            )
            search_results = []
            for result in results:
                try:
                    search_result = {
                        "id": str(result.id),
                        "content": result.payload.get('content', ''),
                        "created_at": result.payload.get('created_at', ''),
                        "agent": result.payload.get('agent', ''),
                        "token_value": result.payload.get('token_value', 0),
                        "similarity": result.score
                    }
                    search_results.append(search_result)
                except Exception as e:
                    logger.error(f"Error processing search result: {e}")
                    continue

            logger.info(f"First 10 search results: {search_results[:10]}")
            logger.info(f"Total number of search results: {len(search_results)}")
            return search_results
        except Exception as e:
            logger.error(f"Error during search operation: {e}")
            return []

    async def upsert(self, content: str, embedding: List[float], is_human_generated: bool) -> None:
        try:
            self.client.upsert(
                collection_name=self.config.MESSAGES_COLLECTION,
                points=[
                    models.PointStruct(
                        id=str(uuid.uuid4()),
                        payload={
                            "content": content,
                            "created_at": datetime.now().isoformat(),
                            "agent": "human" if is_human_generated else "ai",
                            "token_value": 0  # Initialize with 0, update later as needed
                        },
                        vector=embedding,
                    )
                ],
            )
            logger.info(f"Successfully upserted content: {content[:50]}...")
        except (ApiException, UnexpectedResponse) as e:
            logger.error(f"Error during upsert operation: {e}")

    # New methods for 'users' collection
    async def create_user(self, public_key: str) -> User:
        user_id = self.generate_unique_id()
        default_vector = [0.0] * 1536  # Assuming 1536-dimensional vector, adjust if needed
        user = User(id=user_id, public_key=public_key, created_at=datetime.utcnow().isoformat(), vector=default_vector)
        try:
            self.client.upsert(
                collection_name=self.config.USERS_COLLECTION,
                points=[
                    models.PointStruct(
                        id=user.id,
                        vector=user.vector,
                        payload=user.dict(exclude={'vector'})
                    )
                ]
            )
            return user
        except (ApiException, UnexpectedResponse) as e:
            logger.error(f"Error creating user: {e}")
            raise

    async def get_user(self, public_key: str) -> Optional[User]:
        try:
            scroll_result = self.client.scroll(
                collection_name=self.config.USERS_COLLECTION,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="public_key",
                            match=models.MatchValue(value=public_key)
                        )
                    ]
                ),
                limit=1  # We only need one user
            )
            users, _ = scroll_result
            if users:
                return User(**users[0].payload)
            return None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None

    async def get_chat_threads(self, user_id: str) -> List[ChatThread]:
        try:
            # First, retrieve the user to get their chat thread IDs
            user = self.client.retrieve(
                collection_name=self.config.USERS_COLLECTION,
                ids=[user_id]
            )

            if not user:
                logger.error(f"User not found: {user_id}")
                return []

            thread_ids = user[0].payload.get('chat_threads', [])

            # Then, retrieve the chat threads
            threads = self.client.retrieve(
                collection_name=self.config.CHAT_THREADS_COLLECTION,
                ids=thread_ids
            )

            return [ChatThread(**thread.payload) for thread in threads]
        except Exception as e:
            logger.error(f"Error getting chat threads: {e}")
            return []

    async def create_chat_thread(self, user_id: str, name: str) -> ChatThread:
        thread_id = self.generate_unique_id()
        default_vector = [0.0] * 1536  # Assuming 1536-dimensional vector, adjust if needed
        thread = ChatThread(
            id=thread_id,
            user_id=user_id,
            name=name,
            created_at=datetime.utcnow().isoformat(),
            vector=default_vector
        )
        try:
            self.client.upsert(
                collection_name=self.config.CHAT_THREADS_COLLECTION,
                points=[
                    models.PointStruct(
                        id=thread.id,
                        vector=thread.vector,
                        payload=thread.dict(exclude={'vector'})
                    )
                ]
            )
            return thread
        except (ApiException, UnexpectedResponse) as e:
            logger.error(f"Error creating chat thread: {e}")
            raise

    async def save_message(self, message: Message):
        try:
            # First, upsert the message into the messages collection
            self.client.upsert(
                collection_name=self.config.MESSAGES_COLLECTION,
                points=[
                    models.PointStruct(
                        id=message.id,
                        vector=message.vector,
                        payload=message.dict(exclude={"vector"})
                    )
                ]
            )

            # Then, update the chat thread's message list
            default_vector = [0.0] * 1536
            self.client.upsert(
                collection_name=self.config.CHAT_THREADS_COLLECTION,
                points=[
                    models.PointStruct(
                        id=message.thread_id,
                        payload={
                            "messages": {
                                "$append": [message.id]
                            }
                        },
                        vector=default_vector
                    )
                ]
            )
            logger.info(f"Successfully saved message: {message.id} to thread: {message.thread_id}")
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            raise

    async def get_messages_for_thread(self, thread_id: str) -> List[Message]:
        try:
            thread = self.client.retrieve(
                collection_name=self.config.CHAT_THREADS_COLLECTION,
                ids=[thread_id]
            )

            if not thread:
                logger.error(f"Thread not found: {thread_id}")
                return []

            message_ids = thread[0].payload.get('messages', [])

            messages = self.client.retrieve(
                collection_name=self.config.MESSAGES_COLLECTION,
                ids=message_ids
            )

            return [Message(**msg.payload) for msg in messages]
        except Exception as e:
            logger.error(f"Error getting messages for thread {thread_id}: {e}")
            return []
