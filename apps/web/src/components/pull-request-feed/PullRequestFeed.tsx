import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PullRequestFeedListCard from './PullRequestFeedListCard';
import PullRequestFeedDetailCard from './PullRequestFeedDetailCard';

// Types for API responses
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

interface DetailedPullRequestData extends PullRequestListData {
  updated_at: string;
  closed_at: string | null;
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
}

interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

interface ApiResponse {
  data: PullRequestListData[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

interface PullRequestFeedProps {
  username?: string;
  className?: string;
}

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use localhost during build
    return 'http://localhost:3001';
  }
  
  // Client-side: check if we're on localhost or production
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Production - use the consistent root URL format as per user rules
  return 'https://api-github-lmcreans-projects.vercel.app';
};

export const PullRequestFeed: React.FC<PullRequestFeedProps> = ({
  username = 'lmcrean',
  className = ''
}) => {
  // State management
  const [pullRequests, setPullRequests] = useState<PullRequestListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [selectedPR, setSelectedPR] = useState<DetailedPullRequestData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiBaseUrl = getApiBaseUrl();

  // Fetch pull requests list
  const fetchPullRequests = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<ApiResponse>(
        `${apiBaseUrl}/api/github/pull-requests`,
        {
          params: {
            username,
            page,
            per_page: 20
          },
          timeout: 10000 // 10 second timeout
        }
      );

      setPullRequests(response.data.data);
      setPagination(response.data.meta.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching pull requests:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (err.response?.status === 404) {
          setError(`User "${username}" not found.`);
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response?.data?.message || 'Failed to load pull requests.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed pull request data
  const fetchPullRequestDetails = async (pr: PullRequestListData) => {
    try {
      setModalLoading(true);
      setModalError(null);
      
      // Extract owner and repo from HTML URL
      const urlParts = pr.html_url.split('/');
      const owner = urlParts[3];
      const repo = urlParts[4];
      
      const response = await axios.get<DetailedPullRequestData>(
        `${apiBaseUrl}/api/github/pull-requests/${owner}/${repo}/${pr.number}`,
        {
          timeout: 10000
        }
      );

      setSelectedPR(response.data);
    } catch (err) {
      console.error('Error fetching PR details:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setModalError('Request timed out. Please try again.');
        } else if (err.response?.status === 404) {
          setModalError('Pull request not found.');
        } else {
          setModalError(err.response?.data?.message || 'Failed to load pull request details.');
        }
      } else {
        setModalError('Network error. Please check your connection.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  // Handle card click - open modal and fetch details
  const handleCardClick = async (pr: PullRequestListData) => {
    setIsModalOpen(true);
    setSelectedPR(null); // Clear previous data
    await fetchPullRequestDetails(pr);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPR(null);
    setModalError(null);
    setModalLoading(false);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && pagination) {
      if (newPage >= 1 && newPage <= pagination.total_pages) {
        fetchPullRequests(newPage);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchPullRequests();
  }, [username]);

  // Retry function
  const handleRetry = () => {
    fetchPullRequests(currentPage);
  };

  // Loading state
  if (loading && pullRequests.length === 0) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
          <p className="text-gray-600 dark:text-gray-300">Loading pull requests for {username}...</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && pullRequests.length === 0) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
          <p className="text-gray-600 dark:text-gray-300">Error loading pull requests</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Pull Requests</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {pagination 
            ? `Showing ${pullRequests.length} of ${pagination.total_count} pull requests for ${username}`
            : `Recent pull requests for ${username}`
          }
        </p>
      </div>

      {/* Pull request list */}
      <div className="space-y-4 mb-6">
        {pullRequests.map((pr) => (
          <PullRequestFeedListCard
            key={pr.id}
            pullRequest={pr}
            onClick={() => handleCardClick(pr)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <button
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.has_previous_page || loading}
          >
            <span>←</span>
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Page {currentPage} of {pagination.total_pages}
          </div>
          
          <button
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next_page || loading}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && pullRequests.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <PullRequestFeedDetailCard
        pullRequest={selectedPR!}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};

export default PullRequestFeed; 