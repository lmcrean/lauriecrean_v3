/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PullRequestFeedListCard from '../pull-request-feed/PullRequestFeedListCard';

// Mock data
const mockPullRequest = {
  id: 123,
  number: 456,
  title: 'feat: Add new feature to improve user experience',
  description: 'This is a detailed description of the pull request that explains what changes were made and why they were necessary for the application.',
  created_at: '2024-01-15T10:30:00Z',
  merged_at: '2024-01-16T14:45:00Z',
  state: 'merged' as const,
  html_url: 'https://github.com/lmcrean/test-repo/pull/456',
  repository: {
    name: 'test-repo',
    description: 'A test repository for testing purposes',
    language: 'TypeScript',
    html_url: 'https://github.com/lmcrean/test-repo'
  }
};

const mockOpenPullRequest = {
  ...mockPullRequest,
  id: 124,
  number: 457,
  state: 'open' as const,
  merged_at: null,
  title: 'fix: Fix critical bug in authentication system'
};

const mockClosedPullRequest = {
  ...mockPullRequest,
  id: 125,
  number: 458,
  state: 'closed' as const,
  merged_at: null,
  title: 'doc: Update README with installation instructions'
};

describe('PullRequestFeedListCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date for consistent time calculations
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-16T15:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
    });

    it('displays pull request title', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText(mockPullRequest.title)).toBeInTheDocument();
    });

    it('displays pull request number', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('#456')).toBeInTheDocument();
    });

    it('displays repository name', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    it('displays programming language', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('🏷️ TypeScript')).toBeInTheDocument();
    });

    it('displays description when provided', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText(/This is a detailed description/)).toBeInTheDocument();
    });

    it('does not display description section when null', () => {
      const prWithoutDescription = { ...mockPullRequest, description: null };
      render(<PullRequestFeedListCard pullRequest={prWithoutDescription} onClick={mockOnClick} />);
      expect(screen.queryByText('📝')).not.toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('displays merged status correctly', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('merged')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument();
    });

    it('displays open status correctly', () => {
      render(<PullRequestFeedListCard pullRequest={mockOpenPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('open')).toBeInTheDocument();
      expect(screen.getByText('○')).toBeInTheDocument();
    });

    it('displays closed status correctly', () => {
      render(<PullRequestFeedListCard pullRequest={mockClosedPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('closed')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('applies correct CSS classes for merged status', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const statusElement = container.querySelector('.text-purple-600');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('dark:text-purple-400');
    });

    it('applies correct CSS classes for open status', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockOpenPullRequest} onClick={mockOnClick} />);
      const statusElement = container.querySelector('.text-green-600');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('dark:text-green-400');
    });

    it('applies correct CSS classes for closed status', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockClosedPullRequest} onClick={mockOnClick} />);
      const statusElement = container.querySelector('.text-red-600');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass('dark:text-red-400');
    });
  });

  describe('Time Display', () => {
    it('displays relative time correctly', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      // Check that some relative time is displayed (the exact format may vary)
      expect(screen.getByText(/ago$/)).toBeInTheDocument();
    });

    it('displays "just now" for very recent PRs', () => {
      const recentPR = {
        ...mockPullRequest,
        created_at: '2024-01-16T14:59:30Z' // 30 seconds ago
      };
      render(<PullRequestFeedListCard pullRequest={recentPR} onClick={mockOnClick} />);
      expect(screen.getByText('just now')).toBeInTheDocument();
    });
  });

  describe('Title Icons', () => {
    it('displays refactor icon for refactor PRs', () => {
      const refactorPR = { ...mockPullRequest, title: 'refactor: Improve code structure' };
      render(<PullRequestFeedListCard pullRequest={refactorPR} onClick={mockOnClick} />);
      expect(screen.getByText('🔄')).toBeInTheDocument();
    });

    it('displays feature icon for feature PRs', () => {
      const featurePR = { ...mockPullRequest, title: 'feat: Add new dashboard' };
      render(<PullRequestFeedListCard pullRequest={featurePR} onClick={mockOnClick} />);
      expect(screen.getByText('✨')).toBeInTheDocument();
    });

    it('displays bug icon for fix PRs', () => {
      const bugPR = { ...mockPullRequest, title: 'fix: Resolve login issue' };
      render(<PullRequestFeedListCard pullRequest={bugPR} onClick={mockOnClick} />);
      expect(screen.getByText('🐛')).toBeInTheDocument();
    });

    it('displays doc icon for documentation PRs', () => {
      const docPR = { ...mockPullRequest, title: 'doc: Update API documentation' };
      const { container } = render(<PullRequestFeedListCard pullRequest={docPR} onClick={mockOnClick} />);
      // Look for the title icon specifically (larger size)
      const titleIcon = container.querySelector('.text-lg');
      expect(titleIcon).toHaveTextContent('📝');
    });

    it('displays test icon for test PRs', () => {
      const testPR = { ...mockPullRequest, title: 'test: Add unit tests for auth' };
      const { container } = render(<PullRequestFeedListCard pullRequest={testPR} onClick={mockOnClick} />);
      const titleIcon = container.querySelector('.text-lg');
      expect(titleIcon).toHaveTextContent('🧪');
    });

    it('displays style icon for style PRs', () => {
      const stylePR = { ...mockPullRequest, title: 'style: Update button styling' };
      const { container } = render(<PullRequestFeedListCard pullRequest={stylePR} onClick={mockOnClick} />);
      const titleIcon = container.querySelector('.text-lg');
      expect(titleIcon).toHaveTextContent('💄');
    });

    it('displays default icon for other PRs', () => {
      const otherPR = { ...mockPullRequest, title: 'chore: Update dependencies' };
      const { container } = render(<PullRequestFeedListCard pullRequest={otherPR} onClick={mockOnClick} />);
      const titleIcon = container.querySelector('.text-lg');
      expect(titleIcon).toHaveTextContent('📝');
    });
  });

  describe('Language Colors', () => {
    it('applies TypeScript color correctly', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const languageTag = container.querySelector('.bg-blue-600');
      expect(languageTag).toBeInTheDocument();
      expect(languageTag).toHaveTextContent('🏷️ TypeScript');
    });

    it('applies JavaScript color correctly', () => {
      const jsPR = { ...mockPullRequest, repository: { ...mockPullRequest.repository, language: 'JavaScript' }};
      const { container } = render(<PullRequestFeedListCard pullRequest={jsPR} onClick={mockOnClick} />);
      const languageTag = container.querySelector('.bg-yellow-400');
      expect(languageTag).toBeInTheDocument();
    });

    it('does not display language tag when language is null', () => {
      const noLangPR = { ...mockPullRequest, repository: { ...mockPullRequest.repository, language: null }};
      render(<PullRequestFeedListCard pullRequest={noLangPR} onClick={mockOnClick} />);
      expect(screen.queryByText(/🏷️/)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick for other keys', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Tab' });
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA label', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      // Check that aria-label contains expected elements
      const ariaLabel = card.getAttribute('aria-label');
      expect(ariaLabel).toContain('Pull request #456');
      expect(ariaLabel).toContain('merged');
      expect(ariaLabel).toMatch(/ago$/);
    });

    it('has correct tabIndex', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has button role', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('has correct base CSS classes', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = container.querySelector('article');
      
      expect(card).toHaveClass('w-full');
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('dark:bg-gray-800');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-gray-200');
      expect(card).toHaveClass('dark:border-gray-700');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('p-4');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('has correct hover and focus classes', () => {
      const { container } = render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = container.querySelector('article');
      
      expect(card).toHaveClass('hover:bg-gray-50');
      expect(card).toHaveClass('dark:hover:bg-gray-700');
      expect(card).toHaveClass('focus:outline-none');
      expect(card).toHaveClass('focus:ring-2');
      expect(card).toHaveClass('focus:ring-blue-500');
    });

    it('truncates long descriptions', () => {
      const longDescPR = {
        ...mockPullRequest,
        description: 'This is a very long description that should be truncated when it exceeds the maximum character limit set by the truncateText function. It contains way more than 80 characters and should end with ellipsis.'
      };
      
      render(<PullRequestFeedListCard pullRequest={longDescPR} onClick={mockOnClick} />);
      const description = screen.getByText(/This is a very long description/);
      expect(description.textContent).toMatch(/\.\.\.$/);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing repository language gracefully', () => {
      const noLangPR = {
        ...mockPullRequest,
        repository: {
          ...mockPullRequest.repository,
          language: null
        }
      };
      
      expect(() => {
        render(<PullRequestFeedListCard pullRequest={noLangPR} onClick={mockOnClick} />);
      }).not.toThrow();
    });

    it('handles empty description gracefully', () => {
      const emptyDescPR = {
        ...mockPullRequest,
        description: ''
      };
      
      expect(() => {
        render(<PullRequestFeedListCard pullRequest={emptyDescPR} onClick={mockOnClick} />);
      }).not.toThrow();
    });

    it('handles invalid date strings gracefully', () => {
      const invalidDatePR = {
        ...mockPullRequest,
        created_at: 'invalid-date'
      };
      
      expect(() => {
        render(<PullRequestFeedListCard pullRequest={invalidDatePR} onClick={mockOnClick} />);
      }).not.toThrow();
    });
  });
}); 