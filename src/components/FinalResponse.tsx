import React from 'react';

interface FinalResponseProps {
  content: string;
}

const FinalResponse: React.FC<FinalResponseProps> = ({ content }) => {
  return (
    <div className="p-2 mb-2 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white">Final Response</h3>
      <p className="text-sm text-white">{content}</p>
    </div>
  );
};

export default FinalResponse;
