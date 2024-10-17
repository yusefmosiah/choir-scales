import React from 'react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="p-4 mb-4 bg-gray-700 rounded-lg shadow-md">
      <h3 className="mb-2 text-lg font-semibold text-cyan-300">Message ID: {source.id}</h3>
      <p className="mb-3 text-white">{source.content}</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
        <span>Thread ID: {source.thread_id}</span>
        <span>Role: {source.role}</span>
        <span>Created: {new Date(source.created_at).toLocaleString()}</span>
        {source.token_value !== undefined && (
          <span>Token Value: {source.token_value}</span>
        )}
        <span>Similarity: {source.similarity.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SourceCard;
