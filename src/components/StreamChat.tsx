import { useState, useEffect, useRef } from 'react';
import ChorusStep from './ChorusStep';
import FinalResponse from './FinalResponse';
import SourcesColumn from './SourcesColumn';

interface ChorusResponse {
  step: string;
  content: string;
  sources?: Source[];
}

interface Source {
  id: string;
  content: string;
  created_at: string;
  agent: string;
  token_value: number;
  similarity: number;
}

const StreamChat = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { type: 'user' | 'ai'; messages: { step: string; content: string }[] }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [sortOption, setSortOption] = useState<'date' | 'similarity' | 'tokens' | 'custom'>('custom');
  const [showSources, setShowSources] = useState(false);
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
        try {
          const data: ChorusResponse = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          if (data.step) {
            if (data.step === 'experience' && Array.isArray(data.sources)) {
              console.log('Sources received:', data.sources);
              setSources(data.sources);
            }
            setChatHistory(prev => {
              const newHistory = [...prev];
              let content = data.content;
              if (newHistory[newHistory.length - 1].type === 'ai') {
                newHistory[newHistory.length - 1].messages.push({ step: data.step, content });
              } else {
                newHistory.push({ type: 'ai', messages: [{ step: data.step, content }] });
              }
              return newHistory;
            });
            if (data.step === 'final') {
              setIsStreaming(false);
            }
          } else if (data.error) {
            console.error(`WebSocket error: ${data.error}`);
            setIsStreaming(false);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsStreaming(false);
      };
    } else {
      sendMessage(input);
    }
  };

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ prompt: message }));
    }
  };

  const sortSources = (sources: Source[]) => {
    switch (sortOption) {
      case 'date':
        return [...sources].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'similarity':
        return [...sources].sort((a, b) => b.similarity - a.similarity);
      case 'tokens':
        return [...sources].sort((a, b) => b.token_value - a.token_value);
      case 'custom':
      default:
        // Implement custom reranking algorithm here
        return sources;
    }
  };

  const sortedSources = sortSources(sources);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="overflow-hidden flex-grow">
        <div className="flex flex-col h-full lg:flex-row">
          <div className="overflow-y-auto flex-grow p-4" ref={chatContainerRef}>
            {chatHistory.map((chat, chatIndex) => (
              <div key={chatIndex} className={`mb-4 ${chat.type === 'user' ? 'bg-blue-900' : 'bg-gray-900'} rounded-lg p-2`}>
                {chat.type === 'user' && (
                  <div className="p-2 mb-2 bg-blue-800 rounded-lg border border-blue-700">
                    <h3 className="text-lg font-semibold text-white">User</h3>
                    <p className="text-sm text-white">{chat.messages[0].content}</p>
                  </div>
                )}
                {chat.type === 'ai' && chat.messages.map((message, messageIndex) =>
                  message.step === 'final' ? (
                    <FinalResponse key={messageIndex} content={message.content} />
                  ) : (
                    <ChorusStep key={messageIndex} step={message.step} content={message.content} />
                  )
                )}
              </div>
            ))}
          </div>
          {showSources && (
            <div className="overflow-y-auto p-4 bg-gray-800 lg:w-1/3">
              <SourcesColumn
                humanSources={[]}
                aiSources={sortedSources}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            className="flex-grow p-2 text-white bg-gray-700 rounded-l border border-gray-600 resize-none"
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
          <button
            type="button"
            className="p-2 ml-2 text-white bg-gray-700 rounded"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? 'Hide Sources' : 'Show Sources'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StreamChat;
