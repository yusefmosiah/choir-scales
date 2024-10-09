import React from 'react';
import ReactMarkdown from 'react-markdown';
import SourcesList from './SourcesList';
import { Source } from '../types';
interface ChorusStepProps {
  step: string;
  content: string;
  isExperience: boolean;
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const ChorusStep: React.FC<ChorusStepProps> = ({ step, content, isExperience, sources, sortOption, onSortChange }) => {
  return (
    <div className="p-2 mb-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-white capitalize">{step}</h3>
      <div className="mb-2 text-sm text-white">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {isExperience && (
        <SourcesList
          sources={sources}
          sortOption={sortOption}
          onSortChange={onSortChange}
        />
      )}
    </div>
  );
};

export default ChorusStep;
