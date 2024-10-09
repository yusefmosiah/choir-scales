import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Source } from '../types';
interface SourcesListProps {
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const SourcesList: React.FC<SourcesListProps> = ({ sources, sortOption, onSortChange }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white text-md">Sources</h4>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="p-1 text-sm text-white bg-gray-700 rounded"
        >
          <option value="custom">Custom</option>
          <option value="date">Date</option>
          <option value="similarity">Similarity</option>
          <option value="tokens">Tokens</option>
        </select>
      </div>
      <div className="overflow-y-auto flex-grow">
        {sources.map((source, index) => (
          <div key={index} className="p-2 mb-2 text-sm text-white bg-gray-700 rounded-lg">
            <ReactMarkdown>{source.content}</ReactMarkdown>
            <div className="mt-1 text-xs text-gray-400">
              <span>{new Date(source.created_at).toLocaleString()}</span>
              <span className="ml-2">Tokens: {source.token_value}</span>
              <span className="ml-2">Similarity: {source.similarity.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesList;
