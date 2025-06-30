import React from 'react';

// Types based on the API GitHub types
interface PullRequestListData {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
  };
}

interface PullRequestFeedListCardProps {
  pullRequest: PullRequestListData;
  onClick: () => void;
}

// Helper functions
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
};

const getStatusDisplay = (state: string, mergedAt: string | null) => {
  if (mergedAt) return { emoji: '•', text: 'merged', color: 'text-purple-600' };
  if (state === 'open') return { emoji: '○', text: 'open', color: 'text-green-600' };
  return { emoji: '×', text: 'closed', color: 'text-red-600' };
};

const getTitleIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('refactor')) return '🔄';
  if (lowerTitle.includes('feat') || lowerTitle.includes('feature')) return '✨';
  if (lowerTitle.includes('fix') || lowerTitle.includes('bug')) return '🐛';
  if (lowerTitle.includes('doc')) return '📝';
  if (lowerTitle.includes('test')) return '🧪';
  if (lowerTitle.includes('style')) return '💄';
  return '📝';
};

const getLanguageColor = (language: string | null): string => {
  if (!language) return 'bg-gray-500';
  
  const colors: Record<string, string> = {
    'TypeScript': 'bg-blue-600',
    'JavaScript': 'bg-yellow-400',
    'Python': 'bg-blue-500',
    'Java': 'bg-orange-600',
    'CSS': 'bg-purple-600',
    'HTML': 'bg-red-500',
    'React': 'bg-cyan-400',
    'Vue': 'bg-green-500',
  };
  
  return colors[language] || 'bg-gray-500';
};

const truncateText = (text: string | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);
  const relativeTime = getRelativeTime(pullRequest.created_at);
  const titleIcon = getTitleIcon(pullRequest.title);
  const languageColor = getLanguageColor(pullRequest.repository.language);

  return (
    <article 
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Pull request #${pullRequest.number}, ${status.text} ${relativeTime}`}
    >
      {/* Status & Timing Row */}
      <div className="flex justify-between items-center mb-3">
        <div className={`flex items-center space-x-1 ${status.color} font-medium text-sm`}>
          <span>{status.emoji}</span>
          <span>{status.text}</span>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          {relativeTime}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-3">
        <div className="flex items-start space-x-2">
          <span className="text-lg flex-shrink-0 mt-0.5">{titleIcon}</span>
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-2">
            {pullRequest.title}
          </h3>
        </div>
      </div>

      {/* Description Preview */}
      {pullRequest.description && (
        <div className="mb-3">
          <div className="flex items-start space-x-2">
            <span className="text-sm flex-shrink-0 mt-0.5">📝</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {truncateText(pullRequest.description, 80)}
            </p>
          </div>
        </div>
      )}

      {/* Repository & Language */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm">📦</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            {pullRequest.repository.name}
          </span>
        </div>
        {pullRequest.repository.language && (
          <div className="flex items-center space-x-1">
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${languageColor}`}
            >
              🏷️ {pullRequest.repository.language}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row: PR Number & Action */}
      <div className="flex justify-between items-center">
        <div className="text-gray-500 dark:text-gray-400 text-xs font-mono">
          #{pullRequest.number}
        </div>
        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
          <span>👆</span>
          <span>View PR</span>
        </div>
      </div>
    </article>
  );
};

export default PullRequestFeedListCard;
