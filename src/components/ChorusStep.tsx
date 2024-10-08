import React from 'react';

interface ChorusStepProps {
  step: string;
  content: string;
}

const ChorusStep: React.FC<ChorusStepProps> = ({ step, content }) => {
  return (
    <div className="p-2 mb-2 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white">{step.charAt(0).toUpperCase() + step.slice(1)}</h3>
      <p className="text-sm text-white">{content}</p>
    </div>
  );
};

export default ChorusStep;
