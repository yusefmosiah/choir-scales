import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ChorusPanel from "./ChorusPanel";
import UserInput from "./UserInput";
import AIResponse from "./AIResponse";
import ChatThreadList from "./ChatThreadList";
import ReactMarkdown from "react-markdown";
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
} from "../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash"; // Make sure to install lodash if not already present
import { useRouter } from "next/navigation";
import SourceCard from './SourceCard';

const StreamChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [sortOption, setSortOption] = useState<
    "date" | "similarity" | "tokens" | "custom"
  >("custom");
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingPublicKeyRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const wallet = useWallet();
  const router = useRouter();

  // Handler functions using useCallback

  const handleThreadMessages = useCallback((data: ThreadMessagesResponse) => {
    setChatHistory(data.messages);
  }, []);

  const handleSelectThread = useCallback(
    (threadId: string) => {
      console.log(`Selecting thread ${threadId}`);
      setSelectedThread(threadId);
      localStorage.setItem("lastSelectedThread", threadId);
      setChatHistory([]); // Clear previous chat history

      // Request messages for the selected thread
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "get_thread_messages", thread_id: threadId })
        );
      } else {
        console.error(
          "WebSocket is not open. Unable to request thread messages."
        );
      }

      // Focus on the input box
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
    [wsRef, textareaRef] // Added textareaRef to dependencies
  );

  const handleNewThread = useCallback(
    (data: NewThreadResponse) => {
      setChatThreads((prev) => {
        const updatedThreads = [...prev, data.chat_thread];
        console.log("Updated chat threads:", updatedThreads);
        return updatedThreads;
      });
      setIsCreatingThread(false);
      console.log("New thread created and selected:", data.chat_thread.id);

      // Select the new thread and focus input
      handleSelectThread(data.chat_thread.id);
    },
    [handleSelectThread]
  );

  const handleInit = useCallback((data: InitResponse) => {
    setUser(data.user);
    setChatThreads(data.chat_threads);
    console.log("Received chat threads:", data.chat_threads);
    if (data.chat_threads.length > 0) {
      const lastSelectedThread = localStorage.getItem("lastSelectedThread");
      const threadToSelect =
        lastSelectedThread &&
        data.chat_threads.find((thread) => thread.id === lastSelectedThread)
          ? lastSelectedThread
          : data.chat_threads[0].id;
      setSelectedThread(threadToSelect);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "get_thread_messages",
            thread_id: threadToSelect,
          })
        );
      }
    }
  }, []);

  const handleChorusResponse = useCallback(
    (data: ChorusResponse) => {
      if (data.step) {
        if (data.step === "experience" && Array.isArray(data.sources)) {
          console.log("Sources received:", data.sources);
          setSources(data.sources);
        }

        // Generate a unique id for the message
        const newMessage: Message = {
          id: data.messages?.[0]?.id || uuidv4(),  // Use id from data if available, otherwise generate new
          thread_id: selectedThread,
          role: (data.messages?.[0]?.role as 'user' | 'assistant' | 'system') || 'assistant',
          content: data.content || '',
          created_at: new Date().toISOString(),
          step: data.step?.toLowerCase(),
        };
        setChatHistory((prev) => [...prev, newMessage]);

        if (data.step.toLowerCase() === "final") {
          setIsStreaming(false);
        }
      }
    },
    [selectedThread]
  );

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);

        switch (data.type) {
          case "chorus_response":
          case undefined: // If type is undefined, treat it as a ChorusResponse
            handleChorusResponse(data as ChorusResponse);
            break;
          case "thread_messages":
            handleThreadMessages(data as ThreadMessagesResponse);
            break;
          case "new_thread":
            handleNewThread(data as NewThreadResponse);
            break;
          case "init":
            handleInit(data as InitResponse);
            break;
          case "error":
            console.error(`WebSocket error: ${data.error}`);
            setIsStreaming(false);
            break;
          default:
            console.warn("Unknown message type:", data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [handleChorusResponse, handleInit, handleNewThread, handleThreadMessages]
  ); // Add dependencies if necessary

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    wsRef.current = new WebSocket("ws://localhost:8000/ws");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      if (wallet.publicKey) {
        console.log(
          "Sending public key after connection:",
          wallet.publicKey.toString()
        );
        // Add a small delay before sending the public key
        setTimeout(() => {
          wsRef.current?.send(
            JSON.stringify({ public_key: wallet.publicKey?.toString() })
          );
        }, 100);
      }
    };

    wsRef.current.onmessage = handleWebSocketMessage;

    wsRef.current.onclose = (event) => {
      console.log("WebSocket disconnected:", event.reason);
      // Attempt to reconnect after a short delay
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Attempt to reconnect after a short delay
      setTimeout(connectWebSocket, 3000);
    };
  }, [wallet.publicKey, handleWebSocketMessage]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Send public key when it becomes available
  useEffect(() => {
    console.log("Wallet publicKey changed:", wallet.publicKey?.toString());
    if (wallet.publicKey) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Sending public key:", wallet.publicKey.toString());
        wsRef.current.send(
          JSON.stringify({ public_key: wallet.publicKey.toString() })
        );
      } else {
        // Store the public key to send it once the WebSocket is open
        pendingPublicKeyRef.current = wallet.publicKey.toString();
      }
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    chatContainerRef.current?.scrollTo(
      0,
      chatContainerRef.current.scrollHeight
    );
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();
    if (!input.trim() || !selectedThread || !user || isStreaming) {
      console.log("Cannot send message:", {
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
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    setInput("");
    setIsStreaming(true);
  };

  const handleCreateThread = useCallback(() => {
    console.log("handleCreateThread called");
    if (!user?.id) {
      console.log("Cannot create thread: User not available");
      setError(
        "Failed to create new chat. Please try again after connecting your wallet."
      );
      return;
    }
    setIsCreatingThread(true);
    setError(null);
    const threadName = `Chat ${chatThreads.length + 1}`;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "create_thread",
          user_id: user.id,
          name: threadName,
        })
      );
    } else {
      console.log("Cannot create thread:", {
        wsReadyState: wsRef.current?.readyState,
        userId: user?.id,
      });
      setError("Failed to create new chat. Please try again.");
      setIsCreatingThread(false);
      // If WebSocket is not open, try to reconnect
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        connectWebSocket();
      }
    }
  }, [user, chatThreads.length, connectWebSocket]);

  const debouncedCreateThread = useMemo(
    () => debounce(handleCreateThread, 300),
    [handleCreateThread]
  );

  const sortedSources = useMemo(() => {
    return sources.sort((a, b) => {
      // Implement sorting logic based on sortOption
      if (sortOption === "date") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      }
      if (sortOption === "similarity") {
        return (b.similarity || 0) - (a.similarity || 0);
      }
      if (sortOption === "tokens") {
        return (b.token_value || 0) - (a.token_value || 0);
      }
      return 0; // Default for 'custom' or any other option
    });
  }, [sources, sortOption]);

  const renderChatContent = () => {
    let lastActionMessage: Message | null = null;

    return chatHistory
      .filter((msg) => {
        if (msg.role === "assistant" && msg.step === "action") {
          lastActionMessage = msg;
          return false; // Don't render action messages directly
        }
        return (
          msg.role === "user" ||
          (msg.role === "assistant" && msg.step === "final")
        );
      })
      .map((msg, index) => {
        if (msg.role === "user") {
          return <UserInput key={msg.id} content={msg.content} />;
        } else {
          // For assistant messages
          return (
            <AIResponse key={msg.id}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </AIResponse>
          );
        }
      })
      .concat(
        // Add the last action message if there's no final response yet
        lastActionMessage &&
          !chatHistory.some(
            (msg) => msg.role === "assistant" && msg.step === "final"
          ) ? (
          <AIResponse key={lastActionMessage.id}>
            <ReactMarkdown>{lastActionMessage.content}</ReactMarkdown>
          </AIResponse>
        ) : null
      );
  };

  const handleNewChat = useCallback(async () => {
    if (!user?.id) {
      setError("Please connect your wallet to create a new chat.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if there is an existing empty chat thread
      const emptyChatThread = chatThreads.find(
        (thread) => thread.messages.length === 0
      );

      if (emptyChatThread) {
        // Use the existing empty chat thread
        handleSelectThread(emptyChatThread.id);
      } else {
        // Create a new chat thread
        const threadName = `Chat ${chatThreads.length + 1}`;
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "create_thread",
              user_id: user.id,
              name: threadName,
            })
          );
        } else {
          throw new Error("WebSocket is not connected");
        }
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
      setError("Failed to create new chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, chatThreads, handleSelectThread]);

  useEffect(() => {
    // When a new thread is created, select it
    if (chatThreads.length > 0 && !selectedThread) {
      handleSelectThread(chatThreads[chatThreads.length - 1].id);
    }
  }, [chatThreads, selectedThread, handleSelectThread]);

  const renderSources = (sources: Source[]) => {
    return (
      <div className="sources-list">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />   // Use id as key
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex overflow-hidden flex-1">
        {/* Chat Thread List */}
        <ChatThreadList
          chatThreads={chatThreads}
          selectedThread={selectedThread}
          onSelectThread={handleSelectThread}
          onCreateThread={debouncedCreateThread}
          isCreatingThread={isCreatingThread}
          error={error}
        />

        {/* Main Chat Area */}
        <div className="flex overflow-hidden flex-col flex-1">
          <div className="overflow-y-auto flex-1 p-4" ref={chatContainerRef}>
            {renderChatContent()}
          </div>
          {/* Input Area */}
          <div className="p-4 bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                className="flex-1 p-2 text-white bg-gray-900 rounded resize-none"
                rows={1}
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="px-4 py-2 ml-2 font-semibold text-white bg-cyan-500 rounded h-[38px]"
                disabled={!input.trim() || isStreaming}
              >
                Send
              </button>
            </form>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        </div>

        {/* Chorus Panel */}
        <div
          className={`w-1/4 bg-gray-800 overflow-y-auto transition-transform transform
          ${isPanelVisible ? "translate-x-0" : "translate-x-full"}
          fixed top-0 right-0 bottom-0 md:relative md:translate-x-0`}
        >
          <ChorusPanel
            steps={chatHistory.filter(
              (msg) =>
                msg.role === "assistant" && msg.step && msg.step !== "final"
            )}
            sources={sortedSources}
            sortOption={sortOption}
            onSortChange={(option) =>
              setSortOption(
                option as "date" | "similarity" | "tokens" | "custom"
              )
            }
          />
        </div>
      </div>
      {/* Toggle button for mobile */}
      <button
        className="fixed right-4 bottom-20 z-50 p-4 text-2xl text-white bg-cyan-500 rounded-full shadow-lg md:hidden"
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        {isPanelVisible ? "✕" : "☰"}
      </button>
    </div>
  );
};

export default StreamChat;
