import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import SourceCard from './SourceCard';
import { Source } from '../types';

interface ChorusStepProps {
  step: string;
  content: string;
  isExperience: boolean;
  sources: Source[];
  sortOption: string;
  onSortChange: (option: string) => void;
}

type SortOption = 'similarity' | 'created_at' | 'token_value' | 'role' | 'thread_id';

const ChorusStep: React.FC<ChorusStepProps> = ({
  step,
  content,
  isExperience,
  sources,
  sortOption,
  onSortChange,
}) => {
  const [sortOptionState, setSortOptionState] = useState<SortOption>('similarity');

  const sortedSources = useMemo(() => {
    return [...sources].sort((a, b) => {
      switch (sortOptionState) {
        case 'similarity':
          return b.similarity - a.similarity;
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'token_value':
          return (b.token_value || 0) - (a.token_value || 0);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'thread_id':
          return a.thread_id.localeCompare(b.thread_id);
        default:
          return 0;
      }
    });
  }, [sources, sortOptionState]);

  return (
    <div className="p-2 mb-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="mb-2 text-lg font-semibold text-white capitalize">{step}</h3>
      <div className="mb-2 text-sm text-white">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {isExperience && (
        <>
          <div className="mb-2">
            <label htmlFor="sort-select" className="mr-2 text-white">Sort by:</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-gray-700 text-white rounded p-1"
            >
              <option value="similarity">Similarity</option>
              <option value="created_at">Date Created</option>
              <option value="token_value">Token Value</option>
              <option value="role">Role</option>
              <option value="thread_id">Thread ID</option>
            </select>
          </div>
          <div className="sources-list">
            {sortedSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChorusStep;
