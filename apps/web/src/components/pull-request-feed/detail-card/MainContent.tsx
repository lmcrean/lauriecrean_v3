import React from 'react';
import { DetailedPullRequestData } from '@shared/types/pull-requests';
import PullRequestHeader from './PullRequestHeader';
import PullRequestDescription from './PullRequestDescription';
import PullRequestStats from './PullRequestStats';
import PullRequestTimeline from './PullRequestTimeline';
import PullRequestActions from './PullRequestActions';

interface MainContentProps {
  pullRequest: DetailedPullRequestData;
}

export const MainContent: React.FC<MainContentProps> = ({ pullRequest }) => {
  return (
    <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First column - Header and Description */}
        <div className="space-y-6">
          <PullRequestHeader pullRequest={pullRequest} />
          <PullRequestDescription pullRequest={pullRequest} />
        </div>
        
        {/* Second column - Stats, Timeline, and Actions */}
        <div className="space-y-6">
          <PullRequestStats pullRequest={pullRequest} />
          <PullRequestTimeline pullRequest={pullRequest} />
          <PullRequestActions pullRequest={pullRequest} />
        </div>
      </div>
    </div>
  );
};

export default MainContent; 