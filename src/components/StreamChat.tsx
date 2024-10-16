import React, { useState, useEffect, useRef, useCallback } from "react";
import ChorusPanel from "./ChorusPanel";
import UserInput from "./UserInput";
import AIResponse from "./AIResponse";
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

  const wallet = useWallet();

  // Handler functions using useCallback

  const handleThreadMessages = useCallback((data: ThreadMessagesResponse) => {
    setChatHistory(data.messages);
  }, []);

  const handleNewThread = useCallback((data: NewThreadResponse) => {
    setChatThreads((prev) => [...prev, data.chat_thread]);
    setSelectedThread(data.chat_thread.id);
    setChatHistory([]);
  }, []);

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
          id: uuidv4(),
          thread_id: selectedThread,
          role: "assistant",
          content: data.content || "",
          created_at: new Date().toISOString(),
          step: data.step.toLowerCase(),
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
        wsRef.current?.send(
          JSON.stringify({ public_key: wallet.publicKey.toString() })
        );
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

  const handleCreateThread = () => {
    console.log("handleCreateThread called");
    const threadName = `Chat ${chatThreads.length + 1}`;
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      user?.id
    ) {
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
    }
  };

  const handleSelectThread = useCallback((threadId: string) => {
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
  }, []);

  const sortedSources = sources.sort((a, b) => {
    // Implement sorting logic based on sortOption
    return 0; // Placeholder
  });

  const renderChatContent = () => {
    return chatHistory
      .filter(
        (msg) =>
          msg.role === "user" ||
          (msg.role === "assistant" && msg.step === "final")
      )
      .map((msg, index) =>
        msg.role === "user" ? (
          <UserInput key={index} content={msg.content} />
        ) : (
          <AIResponse key={index}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </AIResponse>
        )
      );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]"> {/* Adjust height to account for navbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden w-1/4 p-4 bg-gray-800 overflow-y-auto md:block">
          <h2 className="mb-4 text-xl font-semibold text-white">Chats</h2>
          <button
            className="px-4 py-2 mb-4 w-full font-semibold text-white bg-cyan-500 rounded"
            onClick={handleCreateThread}
          >
            New Chat
          </button>
          <ul className="space-y-2">
            {chatThreads.map((thread) => (
              <li
                key={thread.id}
                className={`p-2 rounded cursor-pointer ${
                  selectedThread === thread.id ? "bg-gray-700" : "bg-gray-900"
                }`}
                onClick={() => handleSelectThread(thread.id)}
              >
                {thread.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
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
          </div>
        </div>

        {/* Chorus Panel */}
        <div className={`w-1/4 bg-gray-800 overflow-y-auto transition-transform transform
          ${isPanelVisible ? "translate-x-0" : "translate-x-full"}
          fixed top-0 right-0 bottom-0 md:relative md:translate-x-0`}>
          <ChorusPanel
            steps={chatHistory.filter(
              (msg) =>
                msg.role === "assistant" && msg.step && msg.step !== "final"
            )}
            sources={sortedSources}
            sortOption={sortOption}
            onSortChange={(option) =>
              setSortOption(option as "date" | "similarity" | "tokens" | "custom")
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
