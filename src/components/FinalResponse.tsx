import React, { useState } from 'react';

interface FinalResponseProps {
  content: string;
  sources: string[];
}

const FinalResponse: React.FC<FinalResponseProps> = ({ content, sources }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg border">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-semibold">Final Response</h3>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="mt-2">
          <p>{content}</p>
          <div className="mt-4">
            <h4 className="font-semibold">Sources:</h4>
            <ul className="pl-5 list-disc">
              {sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalResponse;
