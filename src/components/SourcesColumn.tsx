import React from 'react';
import { Source } from '../types';

interface SourcesColumnProps {
  humanSources: Source[];
  aiSources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const SourcesColumn: React.FC<SourcesColumnProps> = ({
  humanSources,
  aiSources,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="mb-2 text-xl font-bold text-white">Sources</h2>
      <div className="mb-2">
        <label className="mr-2 text-white">Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="p-1 text-white bg-gray-700 rounded"
        >
          <option value="custom">Custom</option>
          <option value="date">Date</option>
          <option value="similarity">Similarity</option>
          <option value="tokens">Tokens</option>
        </select>
      </div>
      <div className="overflow-y-auto flex-grow">
        {humanSources.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-white">Human Sources</h3>
            {humanSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
        {aiSources.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">AI Sources</h3>
            {aiSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
        {humanSources.length === 0 && aiSources.length === 0 && (
          <p className="text-white">No sources available.</p>
        )}
      </div>
    </div>
  );
};

const SourceCard: React.FC<{ source: Source }> = ({ source }) => {
  return (
    <div className="p-2 mb-2 bg-gray-700 rounded-lg">
      <p className="text-sm text-white">{source.content}</p>
      <div className="mt-1 text-xs text-gray-400">
        <span>{new Date(source.created_at).toLocaleString()}</span>
        <span className="ml-2">Tokens: {source.token_value}</span>
        <span className="ml-2">Similarity: {source.similarity.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SourcesColumn;
