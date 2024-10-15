import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChorusPanel from './ChorusPanel';
import UserInput from './UserInput';
import AIResponse from './AIResponse';
import ReactMarkdown from 'react-markdown';
import {
  Source,
  User,
  ChatThread,
  ChorusResponse,
  WebSocketResponse,
  ThreadMessagesResponse,
  NewThreadResponse,
  InitResponse,
  Message,
} from '../types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { v4 as uuidv4 } from 'uuid';

const StreamChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
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
  const pendingPublicKeyRef = useRef<string | null>(null);

  const wallet = useWallet();

  // Handler functions using useCallback

  const handleThreadMessages = useCallback((data: ThreadMessagesResponse) => {
    setChatHistory(data.messages);
  }, []);

  const handleNewThread = useCallback((data: NewThreadResponse) => {
    setChatThreads(prev => [...prev, data.chat_thread]);
    setSelectedThread(data.chat_thread.id);
    setChatHistory([]);
  }, []);

  const handleInit = useCallback((data: InitResponse) => {
    setUser(data.user);
    setChatThreads(data.chat_threads);
    console.log('Received chat threads:', data.chat_threads);
    if (data.chat_threads.length > 0) {
      setSelectedThread(data.chat_threads[0].id);
      // Request messages for the first thread
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'get_thread_messages', thread_id: data.chat_threads[0].id }));
      }
    }
  }, []);

  const handleChorusResponse = useCallback((data: ChorusResponse) => {
    if (data.step) {
      if (data.step === 'experience' && Array.isArray(data.sources)) {
        console.log('Sources received:', data.sources);
        setSources(data.sources);
      }

      // Generate a unique id for the message
      const newMessage: Message = {
        id: uuidv4(),
        thread_id: selectedThread,
        role: 'assistant',
        content: data.content || '',
        created_at: new Date().toISOString(),
        step: data.step.toLowerCase(),
      };
      setChatHistory(prev => [...prev, newMessage]);

      if (data.step.toLowerCase() === 'final') {
        setIsStreaming(false);
      }
    }
  }, [selectedThread]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data: WebSocketResponse = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      switch (data.type) {
        case 'chorus_response':
        case undefined: // If type is undefined, treat it as a ChorusResponse
          handleChorusResponse(data as ChorusResponse);
          break;
        case 'thread_messages':
          handleThreadMessages(data as ThreadMessagesResponse);
          break;
        case 'new_thread':
          handleNewThread(data as NewThreadResponse);
          break;
        case 'init':
          handleInit(data as InitResponse);
          break;
        case 'error':
          console.error(`WebSocket error: ${data.error}`);
          setIsStreaming(false);
          break;
        default:
          console.warn('Unknown message type:', data);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, []); // Empty array if there are no dependencies

  // WebSocket setup (runs once on component mount)
  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws');

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');

      // Send pending public key if available
      if (pendingPublicKeyRef.current) {
        console.log('Sending pending public key after connection:', pendingPublicKeyRef.current);
        wsRef.current?.send(JSON.stringify({ public_key: pendingPublicKeyRef.current }));
        pendingPublicKeyRef.current = null; // Clear the pending public key
      }
    };

    wsRef.current.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      handleWebSocketMessage(event);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup function to close the WebSocket on unmount
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []); // Empty dependency array

  // Send public key when it becomes available
  useEffect(() => {
    console.log('Wallet publicKey changed:', wallet.publicKey?.toString());
    if (wallet.publicKey) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending public key:', wallet.publicKey.toString());
        wsRef.current.send(JSON.stringify({ public_key: wallet.publicKey.toString() }));
      } else {
        // Store the public key to send it once the WebSocket is open
        pendingPublicKeyRef.current = wallet.publicKey.toString();
      }
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault();
    if (!input.trim() || !selectedThread || !user || isStreaming) {
      console.log('Cannot send message:', {
        inputEmpty: !input.trim(),
        selectedThread,
        user,
        isStreaming,
      });
      return;
    }

    // Send the prompt to the backend
    const message = {
      prompt: input,
      thread_id: selectedThread,
    };
    wsRef.current?.send(JSON.stringify(message));

    // Add the user's message to chat history
    const userMessage: Message = {
      id: uuidv4(),
      thread_id: selectedThread,
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, userMessage]);

    setInput('');
    setIsStreaming(true);
  };

  const handleCreateThread = () => {
    console.log('handleCreateThread called');
    const threadName = `Chat ${chatThreads.length + 1}`;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && user?.id) {
      wsRef.current.send(JSON.stringify({ type: 'create_thread', user_id: user.id, name: threadName }));
    } else {
      console.log('Cannot create thread:', {
        wsReadyState: wsRef.current?.readyState,
        userId: user?.id,
      });
    }
  };

  const handleSelectThread = (threadId: string) => {
    console.log(`Selecting thread ${threadId}`);
    setSelectedThread(threadId);
    setChatHistory([]); // Clear previous chat history

    // Request messages for the selected thread
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'get_thread_messages', thread_id: threadId }));
    }
  };

  const sortedSources = sources.sort((a, b) => {
    // Implement sorting logic based on sortOption
    return 0; // Placeholder
  });

  const renderChatContent = () => {
    return chatHistory
      .filter(msg => msg.role === 'user' || (msg.role === 'assistant' && msg.step === 'final'))
      .map((msg, index) =>
        msg.role === 'user' ? (
          <UserInput key={index} content={msg.content} />
        ) : (
          <AIResponse key={index}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </AIResponse>
        )
      );
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Sidebar */}
      <div className="p-4 w-full bg-gray-800 md:w-1/4">
        <h2 className="mb-4 text-xl font-semibold text-white">Chats</h2>
        <button
          className="px-4 py-2 mb-4 w-full font-semibold text-white bg-cyan-500 rounded"
          onClick={handleCreateThread}
        >
          New Chat
        </button>
        <ul className="space-y-2">
          {chatThreads.map(thread => (
            <li
              key={thread.id}
              className={`p-2 rounded cursor-pointer ${selectedThread === thread.id ? 'bg-gray-700' : 'bg-gray-900'}`}
              onClick={() => handleSelectThread(thread.id)}
            >
              {thread.name}
            </li>
          ))}
        </ul>
      </div>
      {/* Main Chat Area */}
      <div className="flex flex-col w-full md:w-3/4">
        <div className="overflow-y-auto flex-1 p-4" ref={chatContainerRef}>
          {renderChatContent()}
        </div>
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            className="p-2 w-full text-white bg-gray-900 rounded"
            rows={1}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 font-semibold text-white bg-cyan-500 rounded"
            disabled={!input.trim() || isStreaming}
          >
            Send
          </button>
        </form>
      </div>
      {/* Chorus Panel */}
      <div
        className={`absolute inset-0 md:relative transition-transform transform ${
          isPanelVisible ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
        } md:w-1/4 bg-gray-800`}
      >
        <ChorusPanel
          steps={chatHistory.filter(msg => msg.role === 'assistant' && msg.step && msg.step !== 'final')}
          sources={sortedSources}
          sortOption={sortOption}
          onSortChange={option =>
            setSortOption(option as 'date' | 'similarity' | 'tokens' | 'custom')
          }
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
