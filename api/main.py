from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from api.vowel_loop import vowel_loop

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
    print("websocket_endpoint called!")
    await websocket.accept()
    try:
        print("WebSocket connection open")
        while True:
            data = await websocket.receive_json()
            user_prompt = data.get("prompt")
            if user_prompt:
                await vowel_loop(user_prompt, websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()
        print("WebSocket connection closed")
