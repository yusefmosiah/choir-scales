from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from vowel_loop import vowel_loop

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

@app.get("/")
async def read_root():
    print("read root called!\n\nHello, World!")
    return {"message": "Hello, World!"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        user_prompt = data.get("prompt")
        if user_prompt:
            await vowel_loop(user_prompt, websocket)
        else:
            await websocket.send_json({"error": "No prompt provided"})
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error: {str(e)}")
        try:
            await websocket.send_json({"error": str(e)})
        except RuntimeError:
            print("Failed to send error message, WebSocket already closed")
    finally:
        try:
            await websocket.close()
        except RuntimeError:
            print("WebSocket already closed")
