import React, { useState } from 'react';
import ChorusPanel from './ChorusPanel';
import { Message, Source, Step } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIResponseProps {
  message: Message;
  sources: Source[];
  steps: Step[];
}

const AIResponse: React.FC<AIResponseProps> = ({ message, sources, steps }) => {
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});
  const [sortOption, setSortOption] = useState('similarity');

  const handleToggleStep = (step: string) => {
    setExpandedSteps(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="p-2 mb-2 w-full bg-teal-900 rounded-lg border border-cyan-700">
      <h3 className="mb-1 text-lg font-semibold text-white">AI</h3>
      <div className="text-sm text-white">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      {steps.map((step, index) => (
        <div key={index} className="mt-2">
          <button
            className="p-2 w-full font-semibold text-left text-white bg-teal-800 rounded-lg"
            onClick={() => handleToggleStep(step.step)}
          >
            {step.step} {expandedSteps[step.step] ? '▲' : '▼'}
          </button>
          {expandedSteps[step.step] && (
            <div className="p-2 mt-2 bg-teal-700 rounded-lg">
              <ReactMarkdown>{step.content}</ReactMarkdown>
              {step.step === 'experience' && (
                <ChorusPanel
                  steps={[step]}
                  sources={sources}
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AIResponse;
