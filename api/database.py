from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import ApiException, UnexpectedResponse
from typing import List, Dict, Any
from datetime import datetime
import uuid
from config import Config
from utils import logger

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

    async def search(self, embedding: List[float]) -> List[str]:
        try:
            results = self.client.search(
                collection_name=self.config.COLLECTION_NAME,
                query_vector=embedding,
                limit=self.config.SEARCH_LIMIT
            )
            search_results = [result.model_dump() for result in results]
            deduplicated_results = self.deduplicate_search_results(search_results)
            return deduplicated_results
        except Exception as e:
            logger.error(f"Error during search operation: {e}")
            return []

    async def upsert(self, content: str, embedding: List[float]) -> None:
        try:
            self.client.upsert(
                collection_name=self.config.COLLECTION_NAME,
                points=[
                    models.PointStruct(
                        id=str(uuid.uuid4()),
                        payload={
                            "content": content,  # Store only content
                            "created_at": datetime.now().isoformat(),
                            "agent": "chorus.000"
                        },
                        vector=embedding,
                    )
                ],
            )
            logger.info(f"Successfully upserted content: {content[:50]}...")
        except (ApiException, UnexpectedResponse) as e:
            logger.error(f"Error during upsert operation: {e}")
