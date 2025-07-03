import React from 'react';
import { render, screen } from '@testing-library/react';
import GitHubBadges from '../GitHubBadges';

describe('GitHubBadges', () => {
  it('renders GitHub badges with correct URLs', () => {
    render(<GitHubBadges repo="lmcrean/dottie" badges="last-commit,created-at" />);
    
    // Check if the correct number of badges are rendered
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(2);
    
    // Check last-commit badge (should be wrapped in a link)
    const lastCommitBadge = screen.getByAltText('Last Commit');
    expect(lastCommitBadge.getAttribute('src')).toBe(
      'https://img.shields.io/github/last-commit/lmcrean/dottie?color=1C1C1C'
    );
    
    // Check created-at badge (should not be wrapped in a link)
    const createdAtBadge = screen.getByAltText('Created at');
    expect(createdAtBadge.getAttribute('src')).toBe(
      'https://img.shields.io/github/created-at/lmcrean/dottie?color=1C1C1C'
    );
  });

  it('wraps badges with links when appropriate', () => {
    render(<GitHubBadges repo="lmcrean/dottie" badges="last-commit,commit-activity" />);
    
    // Check that last-commit badge is wrapped in a link
    const lastCommitLink = screen.getByRole('link', { name: /last commit/i });
    expect(lastCommitLink).toHaveAttribute('href', 'https://github.com/lmcrean/dottie/');
    expect(lastCommitLink).toHaveAttribute('target', '_blank');
    expect(lastCommitLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check that commit-activity badge is wrapped in a link
    const commitActivityLink = screen.getByRole('link', { name: /commit activity/i });
    expect(commitActivityLink).toHaveAttribute('href', 'https://github.com/lmcrean/dottie/commits/main');
  });

  it('handles all badge types correctly', () => {
    render(
      <GitHubBadges 
        repo="lmcrean/test-repo" 
        badges="last-commit,created-at,commit-activity,issues,issues-closed,issues-pr,issues-pr-closed" 
      />
    );
    
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(7);
    
    // Check all badges are present
    expect(screen.getByAltText('Last Commit')).toBeInTheDocument();
    expect(screen.getByAltText('Created at')).toBeInTheDocument();
    expect(screen.getByAltText('Commit Activity')).toBeInTheDocument();
    expect(screen.getByAltText('Issues')).toBeInTheDocument();
    expect(screen.getByAltText('Issues Closed')).toBeInTheDocument();
    
    // Note: issues-pr and issues-pr-closed both have the same alt text
    const prBadges = screen.getAllByAltText('GitHub Issues or Pull Requests');
    expect(prBadges).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <GitHubBadges repo="lmcrean/dottie" badges="last-commit" className="custom-github-badges" />
    );
    
    expect(container.firstChild?.className).toBe('custom-github-badges');
  });

  it('handles custom color', () => {
    render(<GitHubBadges repo="lmcrean/dottie" badges="last-commit" color="FF0000" />);
    
    const badge = screen.getByAltText('Last Commit');
    expect(badge.getAttribute('src')).toBe(
      'https://img.shields.io/github/last-commit/lmcrean/dottie?color=FF0000'
    );
  });

  it('handles whitespace in badges string', () => {
    render(<GitHubBadges repo="lmcrean/dottie" badges=" last-commit , created-at " />);
    
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(2);
  });

  it('handles unknown badge types gracefully', () => {
    // Mock console.warn to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<GitHubBadges repo="lmcrean/dottie" badges="unknown-badge,last-commit" />);
    
    // Should only render the known badge
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(1);
    expect(screen.getByAltText('Last Commit')).toBeInTheDocument();
    
    // Should log warning for unknown badge
    expect(consoleSpy).toHaveBeenCalledWith('Unknown GitHub badge type: unknown-badge');
    
    consoleSpy.mockRestore();
  });
}); 