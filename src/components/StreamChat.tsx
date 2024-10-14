import React, { useState, useEffect, useRef } from 'react';
import ChorusPanel from './ChorusPanel';
import UserInput from './UserInput';
import AIResponse from './AIResponse';
import ReactMarkdown from 'react-markdown';
import { Source, User, ChatThread, ChorusResponse } from '../types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { v4 as uuidv4 } from 'uuid';

const StreamChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { type: 'user' | 'ai'; messages: { step: string; content: string }[] }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [sortOption, setSortOption] = useState<'date' | 'similarity' | 'tokens' | 'custom'>('custom');
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      initializeUser(wallet.publicKey.toString());
    }
  }, [wallet.connected, wallet.publicKey]);

  const initializeUser = async (publicKey: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      wsRef.current.onopen = () => {
        wsRef.current?.send(JSON.stringify({ public_key: publicKey }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'init') {
            setUser(data.user);
            setChatThreads(data.chat_threads);
            console.log("Received chat threads:", data.chat_threads); // Add this line
            if (data.chat_threads.length > 0) {
              setSelectedThread(data.chat_threads[0].id);
            }
          } else if (data.type === 'new_thread') {
            setChatThreads(prev => [...prev, data.chat_thread]);
          } else if (data.type === 'thread_messages') {
            setChatHistory(data.messages.map((msg: any) => ({
              type: msg.role === 'user' ? 'user' : 'ai',
              messages: [{ step: 'message', content: msg.content }]
            })));
          } else {
            handleWebSocketMessage(event);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
  };

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
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedThread) return;

    setIsStreaming(true);
    setChatHistory(prev => [...prev, { type: 'user', messages: [{ step: 'user', content: input }] }]);
    setSources([]);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      wsRef.current.onopen = () => {
        sendMessage(input, selectedThread);
      };
      wsRef.current.onmessage = (event) => {
        handleWebSocketMessage(event);
      };
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsStreaming(false);
      };
    } else {
      sendMessage(input, selectedThread);
    }
  };

  const sendMessage = (message: string, thread_id: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ prompt: message, thread_id }));
    }
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
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
          if (newHistory.length > 0 && newHistory[newHistory.length - 1].type === 'ai') {
            newHistory[newHistory.length - 1].messages.push({ step: data.step, content });
          } else {
            newHistory.push({ type: 'ai', messages: [{ step: data.step, content }] });
          }
          return newHistory;
        });
        if (data.step === 'final') {
          setIsStreaming(false);
        }
      } else if (data.type === 'thread_messages') {
        // Handle received thread messages
        setChatHistory(data.messages.map((msg: any) => ({
          type: msg.role === 'user' ? 'user' : 'ai',
          messages: [{ step: msg.role === 'user' ? 'user' : 'final', content: msg.content }]
        })));
      } else if (data.error) {
        console.error(`WebSocket error: ${data.error}`);
        setIsStreaming(false);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
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

  const renderChatContent = () => {
    return chatHistory.map((chat, chatIndex) => (
      <div key={chatIndex} className="mb-4">
        {chat.type === 'user' && (
          <UserInput content={chat.messages[0].content} />
        )}
        {chat.type === 'ai' && (
          <AIResponse>
            <ReactMarkdown>
              {chat.messages.find(m => m.step === 'final')?.content ||
               chat.messages.find(m => m.step === 'action')?.content || ''}
            </ReactMarkdown>
          </AIResponse>
        )}
      </div>
    ));
  };

  const handleSelectThread = (thread_id: string) => {
    setSelectedThread(thread_id);
    // Optionally, load chat history for the selected thread
    // This will depend on how you manage chat history storage
    // For simplicity, we're keeping chat history in state
  };

  const handleCreateThread = () => {
    const threadName = `Chat ${chatThreads.length + 1}`;
    const newThreadId = uuidv4();
    const newThread: ChatThread = {
      id: newThreadId,
      user_id: user?.id || '',
      name: threadName,
      created_at: new Date().toISOString(),
      messages: []
    };
    setChatThreads(prev => [...prev, newThread]);
    setSelectedThread(newThreadId);
    // Notify backend about the new thread if necessary
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Implement backend notification if needed
    }
  };

  // Add this function to request messages when a thread is selected
  const selectThread = (threadId: string) => {
    setSelectedThread(threadId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'get_thread_messages', thread_id: threadId }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* Left Sidebar for Chat Threads */}
      <div className="hidden flex-col p-4 w-1/4 bg-gray-700 md:flex">
        <h2 className="mb-4 text-xl font-bold text-white">Chat Threads</h2>
        <div className="flex overflow-y-auto flex-col space-y-2">
          {chatThreads.map(thread => (
            <button
              key={thread.id}
              className={`p-2 rounded-md text-left ${selectedThread === thread.id ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-200'}`}
              onClick={() => handleSelectThread(thread.id)}
            >
              {thread.name}
            </button>
          ))}
          <button
            className="p-2 mt-2 text-left text-white bg-green-500 rounded-md"
            onClick={handleCreateThread}
          >
            + New Thread
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow h-full">
        <div className="flex justify-end p-4 bg-gray-900">
        </div>
        <div className="overflow-y-auto flex-grow p-4 w-full" ref={chatContainerRef}>
          <div className="mx-auto max-w-3xl">
            {renderChatContent()}
          </div>
        </div>
        <div className="p-4 mb-4 w-full bg-gray-900"> {/* Added mb-4 for bottom margin */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                className="p-3 pr-24 w-full text-white bg-gray-800 rounded-lg border border-gray-700 resize-none"
                placeholder="Enter your prompt"
                rows={1}
                style={{ minHeight: '2.5rem', maxHeight: '10rem' }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 px-4 py-1 text-white bg-cyan-500 rounded-md transform -translate-y-1/2"
                disabled={isStreaming}
              >
                {isStreaming ? 'Streaming...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`
        fixed md:relative md:w-1/3 lg:w-2/5 xl:w-1/2 inset-x-0 bottom-0 md:inset-y-0 md:right-0
        bg-gray-800 transition-all duration-300 ease-in-out
        ${isPanelVisible ? 'h-3/4 translate-y-0 md:h-full' : 'h-0 translate-y-full md:h-full md:translate-y-0'}
        overflow-y-auto z-10
      `}>
        <ChorusPanel
          steps={chatHistory[chatHistory.length - 1]?.type === 'ai' ? chatHistory[chatHistory.length - 1].messages : []}
          sources={sortedSources}
          sortOption={sortOption}
          onSortChange={(option) => setSortOption(option as 'date' | 'similarity' | 'tokens' | 'custom')}
        />
      </div>
      <button
        className="fixed right-4 bottom-20 z-20 p-4 text-2xl text-white bg-cyan-500 rounded-full shadow-lg md:hidden"
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        {isPanelVisible ? '✕' : '☰'}
      </button>
    </div>
  );
};

export default StreamChat;
