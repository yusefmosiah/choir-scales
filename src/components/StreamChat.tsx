import { useState, useEffect, useRef } from 'react';

const StreamChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ step: string, content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsStreaming(true);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      wsRef.current.onopen = () => {
        sendMessage(input);
      };
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (data.step) {
          setMessages((prevMessages) => [...prevMessages, { step: data.step, content: data.content }]);
          if (data.step === 'final') {
            setIsStreaming(false);
          }
        } else if (data.error) {
          console.error(`WebSocket message received: ${data.error}`);
        }
      };
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsStreaming(false);
      };
    } else {
      sendMessage(input);
    }

    setInput('');
  };

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ prompt: message }));
      setMessages(prev => [...prev, { step: 'user', content: message }]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-2 min-h-screen">
      <div className="p-4 w-full max-w-md text-black bg-white rounded shadow-md overflow-y-auto max-h-[70vh]">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.step === 'user' ? 'text-right' : 'text-left'}`}>
            <strong>{message.step}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 mt-4 w-full max-w-md bg-white rounded shadow-md">
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
    </div>
  );
};

export default StreamChat;
