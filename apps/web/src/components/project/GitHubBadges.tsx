import React from 'react';

interface GitHubBadgeConfig {
  type: string;
  alt: string;
  shieldPath: string;
  linkPath?: string;
}

interface GitHubBadgesProps {
  repo: string; // Format: "lmcrean/dottie"
  badges: string; // Format: "last-commit,created-at,commit-activity,issues,issues-closed,issues-pr,issues-pr-closed"
  color?: string;
  className?: string;
}

const GITHUB_BADGE_CONFIGS: Record<string, GitHubBadgeConfig> = {
  'last-commit': {
    type: 'last-commit',
    alt: 'Last Commit',
    shieldPath: 'last-commit',
    linkPath: ''
  },
  'created-at': {
    type: 'created-at',
    alt: 'Created at',
    shieldPath: 'created-at'
  },
  'commit-activity': {
    type: 'commit-activity',
    alt: 'Commit Activity',
    shieldPath: 'commit-activity/t',
    linkPath: 'commits/main'
  },
  'issues': {
    type: 'issues',
    alt: 'Issues',
    shieldPath: 'issues',
    linkPath: 'issues-open'
  },
  'issues-closed': {
    type: 'issues-closed',
    alt: 'Issues Closed',
    shieldPath: 'issues-closed',
    linkPath: 'issues'
  },
  'issues-pr': {
    type: 'issues-pr',
    alt: 'GitHub Issues or Pull Requests',
    shieldPath: 'issues-pr',
    linkPath: 'pulls'
  },
  'issues-pr-closed': {
    type: 'issues-pr-closed',
    alt: 'GitHub Issues or Pull Requests',
    shieldPath: 'issues-pr-closed',
    linkPath: 'pulls'
  }
};

const GitHubBadges: React.FC<GitHubBadgesProps> = ({ 
  repo, 
  badges, 
  color = '1C1C1C',
  className = 'github-badges'
}) => {
  const badgeTypes = badges.split(',').map(badge => badge.trim()).filter(badge => badge);

  const generateBadgeUrl = (shieldPath: string): string => {
    return `https://img.shields.io/github/${shieldPath}/${repo}?color=${color}`;
  };

  const generateLinkUrl = (linkPath: string): string => {
    return `https://github.com/${repo}/${linkPath}`;
  };

  return (
    <div className={className}>
      <span>Github: </span>
      {badgeTypes.map((badgeType) => {
        const config = GITHUB_BADGE_CONFIGS[badgeType];
        
        if (!config) {
          console.warn(`Unknown GitHub badge type: ${badgeType}`);
          return null;
        }

        const badgeUrl = generateBadgeUrl(config.shieldPath);
        const imgElement = (
          <img 
            src={badgeUrl}
            alt={config.alt}
            key={badgeType}
          />
        );

        // If badge has a link path, wrap in anchor tag
        if (config.linkPath !== undefined) {
          const linkUrl = generateLinkUrl(config.linkPath);
          return (
            <a href={linkUrl} key={badgeType} target="_blank" rel="noopener noreferrer">
              {imgElement}
            </a>
          );
        }

        return imgElement;
      })}
    </div>
  );
};

export default GitHubBadges;
