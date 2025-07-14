/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import PullRequestFeedDetailCard from '../pull-request-feed/detail-card/index';

// Type declaration for Jest globals
declare global {
  var jest: any;
  var describe: any;
  var it: any;
  var test: any;
  var beforeEach: any;
  var afterEach: any;
  var expect: any;
}

// Mock detailed pull request data
const mockDetailedPullRequest = {
  id: 123,
  number: 456,
  title: 'feat: Add new feature to improve user experience',
  description: 'This is a detailed description of the pull request.\n\nIt includes multiple lines and explains the changes made.\n\nThe implementation improves user experience significantly.',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-16T12:15:00Z',
  merged_at: '2024-01-16T14:45:00Z',
  closed_at: null,
  html_url: 'https://github.com/lmcrean/test-repo/pull/456',
  state: 'merged' as const,
  draft: false,
  commits: 8,
  additions: 142,
  deletions: 73,
  changed_files: 12,
  comments: 5,
  author: {
    login: 'lmcrean',
    avatar_url: 'https://github.com/lmcrean.png',
    html_url: 'https://github.com/lmcrean'
  },
  repository: {
    name: 'test-repo',
    description: 'A test repository for testing purposes',
    language: 'TypeScript',
    html_url: 'https://github.com/lmcrean/test-repo'
  }
};

const mockOpenPullRequest = {
  ...mockDetailedPullRequest,
  id: 124,
  number: 457,
  state: 'open' as const,
  merged_at: null,
  title: 'fix: Fix critical bug in authentication system'
};

const mockDraftPullRequest = {
  ...mockDetailedPullRequest,
  id: 125,
  number: 458,
  state: 'open' as const,
  merged_at: null,
  draft: true,
  title: 'draft: Work in progress feature'
};

const mockClosedPullRequest = {
  ...mockDetailedPullRequest,
  id: 126,
  number: 459,
  state: 'closed' as const,
  merged_at: null,
  closed_at: '2024-01-16T16:00:00Z',
  title: 'chore: Update dependencies'
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

// Mock navigator.share
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

describe('PullRequestFeedDetailCard', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date for consistent time formatting
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-16T15:00:00Z'));
    
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.style.overflow = 'unset';
  });

  describe('Modal Behavior', () => {
    it('does not render when isOpen is false', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={false}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('sets body overflow to hidden when modal is open', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('calls onClose when backdrop is clicked', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const backdrop = screen.getByRole('dialog').parentElement;
      fireEvent.click(backdrop!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when modal content is clicked', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const modal = screen.getByRole('dialog');
      fireEvent.click(modal);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when back button is clicked', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const backButton = screen.getByLabelText('Go back');
      fireEvent.click(backButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose for other keys', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('displays loading content when loading is true', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
          loading={true}
        />
      );
      
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2); // Back and close buttons
      
      // Check for loading skeleton
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('displays error content when error is provided', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
          error="Failed to load PR details"
        />
      );
      
      expect(screen.getByText('Error Loading PR')).toBeInTheDocument();
      expect(screen.getByText('Failed to load PR details')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('reloads page when Try Again button is clicked in error state', () => {
      const mockReload = jest.fn();
      Object.defineProperty(window.location, 'reload', {
        writable: true,
        value: mockReload,
      });

      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
          error="Failed to load PR details"
        />
      );
      
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Rendering', () => {
    beforeEach(() => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
    });

    it('displays pull request title', () => {
      expect(screen.getByText(mockDetailedPullRequest.title)).toBeInTheDocument();
    });

    it('displays pull request number', () => {
      expect(screen.getByText('#456')).toBeInTheDocument();
    });

    it('displays author information', () => {
      expect(screen.getByText('lmcrean')).toBeInTheDocument();
    });

    it('displays repository name', () => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    it('displays programming language', () => {
      expect(screen.getByText('🏷️ TypeScript')).toBeInTheDocument();
    });

    it('displays description with line breaks', () => {
      expect(screen.getByText(/This is a detailed description/)).toBeInTheDocument();
      expect(screen.getByText(/It includes multiple lines/)).toBeInTheDocument();
      expect(screen.getByText(/The implementation improves/)).toBeInTheDocument();
    });

    it('displays statistics correctly', () => {
      expect(screen.getByText('+142')).toBeInTheDocument();
      expect(screen.getByText('-73')).toBeInTheDocument();
      expect(screen.getByText('12 files changed')).toBeInTheDocument();
      expect(screen.getByText('5 comments')).toBeInTheDocument();
      expect(screen.getByText('8 commits')).toBeInTheDocument();
    });

    it('displays timeline information', () => {
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
      expect(screen.getByText(/Merged:/)).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('displays merged status correctly', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('merged')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument();
    });

    it('displays open status correctly', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockOpenPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('open')).toBeInTheDocument();
      expect(screen.getByText('○')).toBeInTheDocument();
    });

    it('displays draft status correctly', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDraftPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('draft')).toBeInTheDocument();
    });

    it('displays closed status and timeline correctly', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockClosedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('closed')).toBeInTheDocument();
      expect(screen.getByText(/Closed:/)).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
    });

    it('opens GitHub URL when View on GitHub is clicked', () => {
      const viewButton = screen.getByText('View on GitHub');
      fireEvent.click(viewButton);
      
      expect(window.open).toHaveBeenCalledWith(mockDetailedPullRequest.html_url, '_blank');
    });

    it('copies URL to clipboard when Copy Link is clicked', async () => {
      const copyButton = screen.getByText('Copy Link');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDetailedPullRequest.html_url);
      });
    });

    it('uses navigator.share when Share is clicked and share API is available', async () => {
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(navigator.share).toHaveBeenCalledWith({
          title: `PR #456: ${mockDetailedPullRequest.title}`,
          text: `Check out this pull request by ${mockDetailedPullRequest.author.login}`,
          url: mockDetailedPullRequest.html_url
        });
      });
    });

    it('falls back to clipboard when Share is clicked and share API is not available', async () => {
      // Temporarily remove navigator.share
      const originalShare = navigator.share;
      delete (navigator as any).share;
      
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDetailedPullRequest.html_url);
      });
      
      // Restore navigator.share
      (navigator as any).share = originalShare;
    });
  });

  describe('Conditional Rendering', () => {
    it('does not display description section when description is null', () => {
      const prWithoutDescription = {
        ...mockDetailedPullRequest,
        description: null
      };
      
      render(
        <PullRequestFeedDetailCard
          pullRequest={prWithoutDescription}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('does not display language tag when language is null', () => {
      const prWithoutLanguage = {
        ...mockDetailedPullRequest,
        repository: {
          ...mockDetailedPullRequest.repository,
          language: null
        }
      };
      
      render(
        <PullRequestFeedDetailCard
          pullRequest={prWithoutLanguage}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByText(/🏷️/)).not.toBeInTheDocument();
    });

    it('does not display merged timeline when not merged', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockOpenPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByText(/Merged:/)).not.toBeInTheDocument();
    });

    it('does not display closed timeline when not closed', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByText(/Closed:/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'pr-modal-title');
    });

    it('has proper heading structure', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const mainTitle = screen.getByRole('heading', { level: 1 });
      expect(mainTitle).toHaveAttribute('id', 'pr-modal-title');
      expect(mainTitle).toHaveTextContent(mockDetailedPullRequest.title);
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has proper button labels', () => {
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('has correct dark mode classes', () => {
      const { container } = render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const modal = container.querySelector('.bg-white');
      expect(modal).toHaveClass('dark:bg-gray-800');
      
      const borders = container.querySelectorAll('.border-gray-200');
      borders.forEach(border => {
        expect(border).toHaveClass('dark:border-gray-700');
      });
    });

    it('has proper responsive classes', () => {
      const { container } = render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('w-full');
      expect(modal).toHaveClass('max-w-full');
      expect(modal).toHaveClass('sm:max-w-2xl');
      expect(modal).toHaveClass('rounded-t-lg');
      expect(modal).toHaveClass('sm:rounded-lg');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty statistics gracefully', () => {
      const prWithZeroStats = {
        ...mockDetailedPullRequest,
        commits: 0,
        additions: 0,
        deletions: 0,
        changed_files: 0,
        comments: 0
      };
      
      expect(() => {
        render(
          <PullRequestFeedDetailCard
            pullRequest={prWithZeroStats}
            isOpen={true}
            onClose={mockOnClose}
          />
        );
      }).not.toThrow();
      
      expect(screen.getByText('+0')).toBeInTheDocument();
      expect(screen.getByText('-0')).toBeInTheDocument();
    });

    it('handles missing author information gracefully', () => {
      const prWithMinimalAuthor = {
        ...mockDetailedPullRequest,
        author: {
          login: '',
          avatar_url: '',
          html_url: ''
        }
      };
      
      expect(() => {
        render(
          <PullRequestFeedDetailCard
            pullRequest={prWithMinimalAuthor}
            isOpen={true}
            onClose={mockOnClose}
          />
        );
      }).not.toThrow();
    });

    it('handles clipboard API failures gracefully', async () => {
      // Mock clipboard to reject
      const originalWriteText = navigator.clipboard.writeText;
      navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Clipboard failed'));
      
      render(
        <PullRequestFeedDetailCard
          pullRequest={mockDetailedPullRequest}
          isOpen={true}
          onClose={mockOnClose}
        />
      );
      
      const copyButton = screen.getByText('Copy Link');
      
      expect(() => {
        fireEvent.click(copyButton);
      }).not.toThrow();
      
      // Restore original
      navigator.clipboard.writeText = originalWriteText;
    });
  });
}); 