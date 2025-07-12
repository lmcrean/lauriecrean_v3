import React from 'react';
import { DetailedPullRequestData } from '@shared/types/pull-requests';

interface PullRequestDescriptionProps {
  pullRequest: DetailedPullRequestData;
}

export const PullRequestDescription: React.FC<PullRequestDescriptionProps> = ({ pullRequest }) => {
  if (!pullRequest?.description) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="prose prose-sm max-w-none">
          {pullRequest.description.split('\n').map((line, index) => (
            <p key={index} className="mb-2 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PullRequestDescription; 