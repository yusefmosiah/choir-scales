import React from 'react';
import ReactMarkdown from 'react-markdown';
import SourceCard from './SourceCard';
import { Source } from '../types';

interface ChorusStepProps {
  step: string;
  content: string;
  isExperience: boolean;
  sources: Source[];
}

const ChorusStep: React.FC<ChorusStepProps> = ({
  step,
  content,
  isExperience,
  sources,
}) => {
  return (
    <div className="p-2 mb-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-white capitalize">{step}</h3>
      <div className="mb-2 text-sm text-white">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {isExperience && (
        <div className="sources-list">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChorusStep;
