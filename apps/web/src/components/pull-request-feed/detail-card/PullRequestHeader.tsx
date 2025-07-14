import React from 'react';
import { DetailedPullRequestData } from '@shared/types/pull-requests';
import {
  formatAbsoluteDate,
  getStatusDisplay,
  getTitleIcon,
  getLanguageColor
} from '@shared/types/pull-requests/utilities';

interface PullRequestHeaderProps {
  pullRequest: DetailedPullRequestData;
}

export const PullRequestHeader: React.FC<PullRequestHeaderProps> = ({ pullRequest }) => {
  const status = getStatusDisplay(pullRequest?.state, pullRequest?.merged_at, pullRequest?.draft);
  const titleIcon = getTitleIcon(pullRequest?.title);
  const languageColor = getLanguageColor(pullRequest?.repository?.language);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className={`flex items-center space-x-2 ${status.color} font-medium`}>
          <span className="text-lg">{status.emoji}</span>
          <span className="capitalize">{status.text}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatAbsoluteDate(pullRequest?.merged_at || pullRequest?.created_at)}
        </div>
      </div>

      <div className="space-y-3">
        <h1 id="pr-modal-title" className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
          <span className="text-xl mr-2">{titleIcon}</span>
          {pullRequest?.title || 'Untitled'}
        </h1>
        
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300" data-testid="pr-author">
          <span className="text-lg">👤</span>
          <span className="font-medium">{pullRequest?.author?.login || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-mono">#{pullRequest?.number || 'N/A'}</span>
          <span>•</span>
          <span>{pullRequest?.repository?.name || 'Unknown'}</span>
        </div>
        
        {pullRequest?.repository?.language && (
          <div>
            <span 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${languageColor}`}
            >
              🏷️ {pullRequest.repository.language}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestHeader; 