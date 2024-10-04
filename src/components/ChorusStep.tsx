import React, { useState } from 'react';

interface ChorusStepProps {
  step: string;
  content: string;
}

const ChorusStep: React.FC<ChorusStepProps> = ({ step, content }) => {
  const [isExpanded, setIsExpanded] = useState(step === 'action');

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg border">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-semibold capitalize">{step}</h3>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="mt-2">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default ChorusStep;
