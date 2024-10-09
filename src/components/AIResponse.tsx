import React from 'react';

interface AIResponseProps {
  children: React.ReactNode;
}

const AIResponse: React.FC<AIResponseProps> = ({ children }) => {
  return (
    <div className="p-2 mb-2 w-full bg-teal-900 rounded-lg border border-cyan-700">
      <h3 className="mb-1 text-lg font-semibold text-white">AI</h3>
      <div className="text-sm text-white">{children}</div>
    </div>
  );
};

export default AIResponse;
