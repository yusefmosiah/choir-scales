import React from 'react';
import ChorusStep from './ChorusStep';
import { Message, Source } from '../types';

interface ChorusPanelProps {
  steps: Message[];
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const ChorusPanel: React.FC<ChorusPanelProps> = ({ steps, sources, sortOption, onSortChange }) => {
  return (
    <div className="p-4">
      {steps.map((stepMessage, index) => (
        <ChorusStep
          key={index}
          step={stepMessage.step || ''}
          content={stepMessage.content}
          isExperience={stepMessage.step === 'experience'}
          sources={sources}
          sortOption={sortOption}
          onSortChange={onSortChange}
        />
      ))}
    </div>
  );
};

export default ChorusPanel;
