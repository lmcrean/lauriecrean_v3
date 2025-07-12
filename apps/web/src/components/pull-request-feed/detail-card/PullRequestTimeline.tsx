import React from 'react';
import { DetailedPullRequestData } from '@shared/types/pull-requests';
import { formatAbsoluteDate } from '@shared/types/pull-requests/utilities';

interface PullRequestTimelineProps {
  pullRequest: DetailedPullRequestData;
}

export const PullRequestTimeline: React.FC<PullRequestTimelineProps> = ({ pullRequest }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timeline</h2>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest?.created_at)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Updated:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest?.updated_at)}</span>
          </div>
          {pullRequest?.merged_at && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merged:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.merged_at)}</span>
            </div>
          )}
          {pullRequest?.closed_at && !pullRequest?.merged_at && (
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Closed:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.closed_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PullRequestTimeline; 