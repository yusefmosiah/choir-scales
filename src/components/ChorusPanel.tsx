import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ChorusStep from './ChorusStep';
import SourcesList from './SourcesList';

interface ChorusPanelProps {
  steps: { step: string; content: string }[];
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const ChorusPanel: React.FC<ChorusPanelProps> = ({ steps, sources, sortOption, onSortChange }) => {
  const [isStepsExpanded, setIsStepsExpanded] = useState(false);

  return (
    <div className="flex flex-col p-4 h-full bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-white">Chorus Panel</h2>

      {/* Chorus Steps Section */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center p-3 w-full text-left text-white bg-gray-700 rounded-lg transition-colors hover:bg-gray-600"
          onClick={() => setIsStepsExpanded(!isStepsExpanded)}
        >
          <span className="font-semibold">Chorus Steps</span>
          <span>{isStepsExpanded ? '▼' : '▶'}</span>
        </button>
        {isStepsExpanded && (
          <div className="overflow-y-auto p-3 mt-2 max-h-64 bg-gray-700 rounded-lg">
            {steps.map((step, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <h3 className="mb-1 font-semibold text-white capitalize">{step.step}</h3>
                <div className="text-sm text-gray-300">
                  <ReactMarkdown>{step.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources Section */}
      <div className="overflow-y-auto flex-grow">
        <h3 className="mb-2 text-lg font-semibold text-white">Sources</h3>
        <SourcesList
          sources={sources}
          sortOption={sortOption}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default ChorusPanel;
