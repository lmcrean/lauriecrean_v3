import React, { useEffect } from 'react';

// Extended type for detailed PR data
interface DetailedPullRequestData {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  closed_at: string | null;
  html_url: string;
  state: 'open' | 'closed' | 'merged';
  draft?: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
  };
}

interface PullRequestFeedDetailCardProps {
  pullRequest: DetailedPullRequestData;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  error?: string;
}

// Helper functions
const formatAbsoluteDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getStatusDisplay = (state: string, mergedAt: string | null, draft?: boolean) => {
  if (draft) return { emoji: '•', text: 'draft', color: 'text-gray-600 dark:text-gray-400' };
  if (mergedAt) return { emoji: '•', text: 'merged', color: 'text-purple-600 dark:text-purple-400' };
  if (state === 'open') return { emoji: '○', text: 'open', color: 'text-green-600 dark:text-green-400' };
  return { emoji: '×', text: 'closed', color: 'text-red-600 dark:text-red-400' };
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

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

const shareData = async (pullRequest: DetailedPullRequestData): Promise<void> => {
  const shareData = {
    title: `PR #${pullRequest.number}: ${pullRequest.title}`,
    text: `Check out this pull request by ${pullRequest.author.login}`,
    url: pullRequest.html_url
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    await copyToClipboard(pullRequest.html_url);
  }
};

export const PullRequestFeedDetailCard: React.FC<PullRequestFeedDetailCardProps> = ({
  pullRequest,
  isOpen,
  onClose,
  loading = false,
  error
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Modal backdrop and container classes
  const backdropClasses = "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center";
  const containerClasses = "w-full max-w-full sm:max-w-2xl bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-xl transform transition-all duration-300 ease-out max-h-full overflow-hidden animate-slide-up sm:animate-fade-in";

  if (loading) {
    return (
      <div className={backdropClasses} onClick={onClose}>
        <div 
          className={containerClasses} 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <button 
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" 
              onClick={onClose} 
              aria-label="Go back"
            >
              <span>←</span>
              <span className="font-medium">Back</span>
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl transition-colors" 
              onClick={onClose} 
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          {/* Loading Content */}
          <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={backdropClasses} onClick={onClose}>
        <div 
          className={containerClasses} 
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <button 
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" 
              onClick={onClose} 
              aria-label="Go back"
            >
              <span>←</span>
              <span className="font-medium">Back</span>
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl transition-colors" 
              onClick={onClose} 
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          {/* Error Content */}
          <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading PR</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <button 
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at, pullRequest.draft);
  const titleIcon = getTitleIcon(pullRequest.title);
  const languageColor = getLanguageColor(pullRequest.repository.language);

  return (
    <div 
      className={backdropClasses}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-modal-title"
      data-testid="pull-request-modal"
    >
      <div className={containerClasses} onClick={(e) => e.stopPropagation()} data-testid="pull-request-detail">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <button 
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" 
            onClick={onClose} 
            aria-label="Go back"
            data-testid="close-modal"
          >
            <span>←</span>
            <span className="font-medium">Back</span>
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl transition-colors" 
            onClick={onClose} 
            aria-label="Close modal"
            data-testid="modal-close-x"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          {/* Status & Title Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className={`flex items-center space-x-2 ${status.color} font-medium`}>
                <span className="text-lg">{status.emoji}</span>
                <span className="capitalize">{status.text}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatAbsoluteDate(pullRequest.merged_at || pullRequest.created_at)}
              </div>
            </div>

            <div className="space-y-3">
              <h1 id="pr-modal-title" className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="text-2xl mr-2">{titleIcon}</span>
                {pullRequest.title}
              </h1>
              
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300" data-testid="pr-author">
                <span className="text-lg">👤</span>
                <span className="font-medium">{pullRequest.author.login}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-mono">#{pullRequest.number}</span>
                <span>•</span>
                <span>{pullRequest.repository.name}</span>
              </div>
              
              {pullRequest.repository.language && (
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

          {/* Description Section */}
          {pullRequest.description && (
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
          )}

          {/* Statistics Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stats</h2>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2" data-testid="pr-additions">
                  <span className="text-lg">📊</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{pullRequest.additions}</span>
                    {' '}
                    <span className="text-red-600 dark:text-red-400 font-medium" data-testid="pr-deletions">-{pullRequest.deletions}</span>
                    {' '}changes
                  </span>
                </div>
                <div className="flex items-center space-x-2" data-testid="pr-changed-files">
                  <span className="text-lg">📁</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{pullRequest.changed_files} files changed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💬</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{pullRequest.comments} comments</span>
                </div>
                <div className="flex items-center space-x-2" data-testid="pr-commits">
                  <span className="text-lg">✅</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{pullRequest.commits} commits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timeline</h2>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Updated:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.updated_at)}</span>
                </div>
                {pullRequest.merged_at && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merged:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.merged_at)}</span>
                  </div>
                )}
                {pullRequest.closed_at && !pullRequest.merged_at && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Closed:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatAbsoluteDate(pullRequest.closed_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Actions</h2>
            <div className="space-y-3">
              <button 
                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                onClick={() => window.open(pullRequest.html_url, '_blank')}
                data-testid="github-link"
              >
                View on GitHub
              </button>
              <button 
                className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                onClick={() => copyToClipboard(pullRequest.html_url)}
              >
                Copy Link
              </button>
              <button 
                className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                onClick={() => shareData(pullRequest)}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullRequestFeedDetailCard;
