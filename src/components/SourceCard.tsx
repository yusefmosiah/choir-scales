import React from 'react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="source-card">
      <h3>Message ID: {source.id}</h3>
      <p>{source.content}</p>
      <div className="metadata">
        <span>Thread ID: {source.thread_id}</span>
        <span>Role: {source.role}</span>
        <span>Created At: {new Date(source.created_at).toLocaleString()}</span>
        {/* Only display token_value if it's available */}
        {source.token_value !== undefined && (
          <span>Token Value: {source.token_value}</span>
        )}
        <span>Similarity: {source.similarity.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SourceCard;
