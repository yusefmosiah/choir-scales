from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from chorus import Chorus
from config import Config
from database import DatabaseClient
from utils import logger

app = FastAPI()

origins = [
    "http://localhost:3000",  # For local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

config = Config()
db_client = DatabaseClient(config)
chorus = Chorus(config, db_client)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    chat_history = []
    try:
        while True:
            data = await websocket.receive_json()
            user_prompt = data.get("prompt")
            if user_prompt:
                chat_history = await chorus.run(user_prompt, websocket, chat_history)
            else:
                await websocket.send_json({"error": "No prompt provided"})
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        try:
            await websocket.send_json({"error": str(e)})
        except RuntimeError:
            logger.error("Failed to send error message, WebSocket already closed")
    finally:
        try:
            await websocket.close()
        except RuntimeError:
            logger.error("WebSocket already closed")
