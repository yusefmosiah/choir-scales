import React from 'react';
import { Source } from '../types';

interface SourcesListProps {
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

const SourcesList: React.FC<SourcesListProps> = ({ sources, sortOption, onSortChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white text-md">Citations</h4>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="p-1 text-white bg-gray-700 rounded"
        >
          <option value="date">Date</option>
          <option value="similarity">Similarity</option>
          <option value="tokens">Tokens</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <ul className="space-y-2">
        {sources.map(source => (
          <li key={source.id} className="text-sm text-cyan-200">
            <a href={`#${source.id}`} className="underline">
              {source.content.slice(0, 100)}... {/* Truncate for brevity */}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourcesList;
