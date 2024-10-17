import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import UserInput from './UserInput';
import AIResponse from './AIResponse';

interface ChatWindowProps {
  chatHistory: Message[];
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, chatContainerRef }) => {
  return (
    <div className="overflow-y-auto flex-1 p-4" ref={chatContainerRef}>
      {/* Render chat messages */}
      {chatHistory.map((msg) => {
        if (msg.role === 'user') {
          return <UserInput key={msg.id} content={msg.content} />;
        } else {
          return (
            <AIResponse key={msg.id}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </AIResponse>
          );
        }
      })}
    </div>
  );
};

export default ChatWindow;
