import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PullRequestFeed from '../../apps/web/src/components/pull-request-feed/PullRequestFeed';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock data
const mockPullRequests = [
  {
    id: 1,
    number: 20,
    title: 'refactor frontend dir to apps/web',
    description: 'this will be for greater sustainability',
    created_at: '2024-06-30T10:39:00Z',
    merged_at: '2024-06-30T16:39:00Z',
    state: 'merged' as const,
    html_url: 'https://github.com/lmcrean/lauriecrean_v3/pull/20',
    repository: {
      name: 'lauriecrean_v3',
      description: 'Portfolio website v3',
      language: 'TypeScript',
      html_url: 'https://github.com/lmcrean/lauriecrean_v3'
    }
  },
  {
    id: 2,
    number: 19,
    title: 'feat: add new button component',
    description: 'Added reusable button component with variants',
    created_at: '2024-06-29T14:20:00Z',
    merged_at: null,
    state: 'open' as const,
    html_url: 'https://github.com/lmcrean/lauriecrean_v3/pull/19',
    repository: {
      name: 'lauriecrean_v3',
      description: 'Portfolio website v3',
      language: 'JavaScript',
      html_url: 'https://github.com/lmcrean/lauriecrean_v3'
    }
  }
];

const mockDetailedPR = {
  ...mockPullRequests[0],
  updated_at: '2024-06-30T16:35:00Z',
  closed_at: null,
  draft: false,
  commits: 12,
  additions: 245,
  deletions: 123,
  changed_files: 15,
  comments: 3,
  author: {
    login: 'lmcrean',
    avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
    html_url: 'https://github.com/lmcrean'
  }
};

const mockApiResponse = {
  data: mockPullRequests,
  meta: {
    username: 'lmcrean',
    count: 2,
    pagination: {
      page: 1,
      per_page: 20,
      total_count: 2,
      total_pages: 1,
      has_next_page: false,
      has_previous_page: false
    }
  }
};

describe('PullRequestFeed Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document body overflow
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up any lingering modals
    document.body.style.overflow = 'unset';
  });

  describe('API Integration', () => {
    it('should fetch and display pull requests from API', async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });

      render(<PullRequestFeed username="lmcrean" />);

      // Should show loading state initially
      expect(screen.getByText('Loading pull requests for lmcrean...')).toBeInTheDocument();

      // Wait for API call and data to load
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });

      // Verify API was called with correct parameters
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/github/pull-requests'),
        expect.objectContaining({
          params: {
            username: 'lmcrean',
            page: 1,
            per_page: 20
          },
          timeout: 10000
        })
      );

      // Verify both PRs are rendered
      expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      expect(screen.getByText('feat: add new button component')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      render(<PullRequestFeed username="lmcrean" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Failed to Load Pull Requests')).toBeInTheDocument();
      });

      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should retry API call when retry button is clicked', async () => {
      // Mock initial error then success
      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockApiResponse });

      render(<PullRequestFeed username="lmcrean" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      // Click retry button
      fireEvent.click(screen.getByText('Try Again'));

      // Should show loading and then data
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });

      // Should have made 2 API calls
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Interactions', () => {
    beforeEach(async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });
    });

    it('should open detailed modal when card is clicked', async () => {
      // Mock detailed PR API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockDetailedPR });

      // Click on the first PR card
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      expect(prCard).toBeInTheDocument();
      
      fireEvent.click(prCard!);

      // Should show modal loading state
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for detailed data to load
      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Timeline')).toBeInTheDocument();
      });

      // Verify detailed API call was made
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/github/pull-requests/lmcrean/lauriecrean_v3/20'),
        expect.objectContaining({
          timeout: 10000
        })
      );
    });

    it('should close modal when close button is clicked', async () => {
      // Mock detailed PR API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockDetailedPR });

      // Open modal
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      fireEvent.click(prCard!);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close modal when escape key is pressed', async () => {
      // Mock detailed PR API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockDetailedPR });

      // Open modal
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      fireEvent.click(prCard!);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press escape key
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Environment Detection', () => {
    it('should use localhost URL in development', () => {
      // Mock window.location for localhost
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost'
        },
        writable: true
      });

      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/github/pull-requests',
        expect.any(Object)
      );
    });

    it('should use production URL in production', () => {
      // Mock window.location for production
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'lauriecrean.com'
        },
        writable: true
      });

      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api-github-lmcreans-projects.vercel.app/api/github/pull-requests',
        expect.any(Object)
      );
    });
  });

  describe('Pagination', () => {
    it('should handle pagination when multiple pages exist', async () => {
      const mockPaginatedResponse = {
        ...mockApiResponse,
        meta: {
          ...mockApiResponse.meta,
          pagination: {
            page: 1,
            per_page: 20,
            total_count: 50,
            total_pages: 3,
            has_next_page: true,
            has_previous_page: false
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockPaginatedResponse });
      render(<PullRequestFeed username="lmcrean" />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      // Next button should be enabled, Previous should be disabled
      const nextButton = screen.getByText('Next');
      const prevButton = screen.getByText('Previous');
      
      expect(nextButton).not.toBeDisabled();
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);
      
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA labels on cards', () => {
      const prCard = screen.getByLabelText(/Pull request #20, merged/);
      expect(prCard).toBeInTheDocument();
      expect(prCard).toHaveAttribute('role', 'button');
      expect(prCard).toHaveAttribute('tabIndex', '0');
    });

    it('should support keyboard navigation on cards', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockDetailedPR });

      const prCard = screen.getByLabelText(/Pull request #20, merged/);
      
      // Focus the card and press Enter
      prCard.focus();
      fireEvent.keyDown(prCard, { key: 'Enter', code: 'Enter' });

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
}); 