from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from chorus import Chorus
from config import Config
from database import DatabaseClient
from utils import logger
from pydantic import BaseModel
from models import User, ChatThread

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

class ConnectRequest(BaseModel):
    public_key: str

class MessageRequest(BaseModel):
    prompt: str
    thread_id: str

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if 'public_key' in data:
                public_key = data['public_key']
                user = await db_client.get_user(public_key)
                if not user:
                    user = await db_client.create_user(public_key)
                chat_threads = await db_client.get_chat_threads(user.id)
                await websocket.send_json({
                    "type": "init",
                    "user": user.dict(),
                    "chat_threads": [thread.dict() for thread in chat_threads]
                })
            elif 'type' in data and data['type'] == 'get_thread_messages':
                thread_id = data['thread_id']
                messages = await db_client.get_messages_for_thread(thread_id)
                await websocket.send_json({
                    'type': 'thread_messages',
                    'thread_id': thread_id,
                    'messages': [msg.dict() for msg in messages]
                })
            elif 'prompt' in data:
                user_prompt = data['prompt']
                thread_id = data['thread_id']
                chat_history = await db_client.get_messages_for_thread(thread_id)
                await chorus.run(user_prompt, websocket, chat_history, thread_id)
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        await websocket.send_json({"error": str(e)})
