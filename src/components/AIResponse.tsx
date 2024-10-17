import React, { useState } from 'react';
import ChorusPanel from './ChorusPanel';
import { Message, Source } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIResponseProps {
  message: Message;
  sources: Source[];
}

const AIResponse: React.FC<AIResponseProps> = ({ message, sources }) => {
  const [showChorusPanel, setShowChorusPanel] = useState(false);
  const [sortOption, setSortOption] = useState('similarity');

  const handleToggleChorusPanel = () => {
    setShowChorusPanel(!showChorusPanel);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div
      className="p-2 mb-2 w-full bg-teal-900 rounded-lg border border-cyan-700 cursor-pointer"
      onClick={handleToggleChorusPanel}
    >
      <h3 className="mb-1 text-lg font-semibold text-white">AI</h3>
      <div className="text-sm text-white">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      {showChorusPanel && (
        <ChorusPanel
          steps={[{ step: message.step || 'response', content: message.content }]}
          sources={sources}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />
      )}
    </div>
  );
};

export default AIResponse;
