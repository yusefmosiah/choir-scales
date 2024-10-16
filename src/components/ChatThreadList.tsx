import React from 'react';
import { ChatThread } from '../types';

interface ChatThreadListProps {
  chatThreads: ChatThread[];
  selectedThread: string;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  isCreatingThread: boolean;
  error: string | null;
}

const ChatThreadList: React.FC<ChatThreadListProps> = ({
  chatThreads,
  selectedThread,
  onSelectThread,
  onCreateThread,
  isCreatingThread,
  error
}) => {
  return (
    <div className="hidden overflow-y-auto p-4 w-1/4 bg-gray-800 md:block">
      <h2 className="mb-4 text-xl font-semibold text-white">Chats</h2>
      <button
        className="px-4 py-2 mb-4 w-full font-semibold text-white bg-cyan-500 rounded disabled:bg-gray-400"
        onClick={onCreateThread}
        disabled={isCreatingThread}
      >
        {isCreatingThread ? "Creating..." : "New Chat"}
      </button>
      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
      <ul className="space-y-2">
        {chatThreads.map((thread) => (
          <li
            key={thread.id}
            className={`p-2 rounded cursor-pointer ${
              selectedThread === thread.id ? "bg-gray-700" : "bg-gray-900"
            }`}
            onClick={() => onSelectThread(thread.id)}
          >
            {thread.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatThreadList;
