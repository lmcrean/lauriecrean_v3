import React from 'react';
import { DetailedPullRequestData } from '@shared/types/pull-requests';
import { shareData, copyToClipboard } from '@shared/types/pull-requests/detail-utilities';

interface PullRequestActionsProps {
  pullRequest: DetailedPullRequestData;
}

export const PullRequestActions: React.FC<PullRequestActionsProps> = ({ pullRequest }) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Actions</h2>
      <div className="space-y-3">
        <button 
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          onClick={() => pullRequest?.html_url && window.open(pullRequest.html_url, '_blank')}
          data-testid="github-link"
          disabled={!pullRequest?.html_url}
        >
          View on GitHub
        </button>
        <button 
          className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          onClick={() => pullRequest?.html_url && copyToClipboard(pullRequest.html_url)}
          disabled={!pullRequest?.html_url}
        >
          Copy Link
        </button>
        <button 
          className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          onClick={() => pullRequest && shareData(pullRequest)}
          disabled={!pullRequest}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default PullRequestActions; 