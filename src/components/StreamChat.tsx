import { useState, useEffect, useRef } from 'react';
import ChorusStep from './ChorusStep';
import FinalResponse from './FinalResponse';
import SourcesColumn from './SourcesColumn';

const StreamChat = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'ai', messages: { step: string, content: string }[] }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsStreaming(true);
    setChatHistory(prev => [...prev, { type: 'user', messages: [{ step: 'user', content: input }] }]);
    setSources([]);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      wsRef.current.onopen = () => {
        sendMessage(input);
      };
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (data.step) {
          if (data.step === 'experience') {
            setSources(data.content.split('\n').filter((line: string) => line.startsWith('Search Results:')));
          }
          setChatHistory(prev => {
            const newHistory = [...prev];
            if (newHistory[newHistory.length - 1].type === 'ai') {
              newHistory[newHistory.length - 1].messages.push({ step: data.step, content: data.content });
            } else {
              newHistory.push({ type: 'ai', messages: [{ step: data.step, content: data.content }] });
            }
            return newHistory;
          });
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ prompt: message }));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="overflow-hidden flex-grow">
        <div className="flex flex-col h-full lg:flex-row">
          <div className="overflow-y-auto flex-grow p-4" ref={chatContainerRef}>
            {chatHistory.map((chat, chatIndex) => (
              <div key={chatIndex} className={`p-2 rounded mb-4 ${chat.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {chat.messages.map((message, messageIndex) => (
                  message.step === 'final' ? (
                    <FinalResponse key={messageIndex} content={message.content} sources={sources} />
                  ) : (
                    <ChorusStep key={messageIndex} step={message.step} content={message.content} />
                  )
                ))}
              </div>
            ))}
          </div>
          <SourcesColumn sources={sources} />
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            className="overflow-hidden flex-grow p-2 text-black rounded-l border resize-none"
            placeholder="Enter your prompt"
            rows={1}
            style={{ minHeight: '2.5rem', maxHeight: '10rem' }}
          />
          <button
            type="submit"
            className="p-2 h-full text-white bg-blue-500 rounded-r"
            disabled={isStreaming}
          >
            {isStreaming ? 'Streaming...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StreamChat;
