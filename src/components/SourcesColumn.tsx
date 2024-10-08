import React from 'react';

interface SourcesColumnProps {
  sources: string[];
}

const SourcesColumn: React.FC<SourcesColumnProps> = ({ sources }) => {
  return (
    <div className="p-4 w-full bg-gray-900 lg:w-1/3">
      <h2 className="mb-4 text-xl font-semibold text-white">Sources</h2>
      <div className="space-y-4">
        {sources.map((sourceContent, index) => (
          <div key={index} className="p-4 text-white bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm">{sourceContent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesColumn;
