import React from 'react';
import { Message } from '../types';
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
          return (
            <div key={msg.id} className="user-message">
              {msg.content}
            </div>
          );
        } else {
          return (
            <AIResponse
              key={msg.id}
              message={msg}
              sources={[]} // Add appropriate sources if available
              steps={[]}   // Add appropriate steps if available
            />
          );
        }
      })}
    </div>
  );
};

export default ChatWindow;
