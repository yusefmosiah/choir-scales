from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import ApiException, UnexpectedResponse
from typing import List, Dict, Any
from datetime import datetime
import uuid
from config import Config
from utils import logger
import json

class DatabaseClient:
    def __init__(self, config: Config):
        self.config = config
        self.client = QdrantClient(url=config.QDRANT_URL, api_key=config.QDRANT_API_KEY)

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
                collection_name=self.config.COLLECTION_NAME,
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
                collection_name=self.config.COLLECTION_NAME,
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
