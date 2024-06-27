import { useState, useEffect } from 'react';

const StreamChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ step: string, content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages([]);
    setIsStreaming(true);

    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({ prompt: input }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      if (data.step) {
        setMessages((prevMessages) => [...prevMessages, { step: data.step, content: data.content }]);
      } else if (data.error) {
        console.error(`WebSocket message received: ${data.error}`);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsStreaming(false);
    };
  };

  return (
    <div className="flex flex-col justify-center items-center py-2 min-h-screen">
      <form onSubmit={handleSubmit} className="p-4 w-full max-w-md bg-white rounded shadow-md">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="p-2 mb-4 w-full text-black rounded border"
          placeholder="Enter your prompt"
        />
        <button
          type="submit"
          className="p-2 w-full text-white bg-blue-500 rounded"
          disabled={isStreaming}
        >
          {isStreaming ? 'Streaming...' : 'Submit'}
        </button>
      </form>
      <div className="p-4 mt-4 w-full max-w-md text-black bg-white rounded shadow-md">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <strong>{message.step}:</strong> {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamChat;
