# API Endpoints - GitHub Integration API

> **Detailed endpoint documentation** for the GitHub portfolio API

## Base URL
```
Development: http://localhost:3001/api/github/v1
Production: https://api-github-lmcreans-projects.vercel.app/api/github/v1
```

## Authentication
- **GitHub Token**: Required in environment variables
- **No user authentication**: Public read-only access
- **Rate limiting**: Applied per IP address

## Pull Request Endpoints

### GET `/pull-requests/history`
Retrieve comprehensive pull request history for a user.

**Query Parameters:**
```typescript
{
  username: string;          // GitHub username (default: lmcrean)
  limit?: number;           // Results per page (default: 50, max: 100)
  offset?: number;          // Pagination offset (default: 0)
  state?: 'open' | 'closed' | 'merged' | 'all';  // PR state filter
  sort?: 'created' | 'updated' | 'merged';       // Sort order
  direction?: 'asc' | 'desc';                    // Sort direction
}
```

**Response:**
```typescript
{
  data: PullRequestResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    username: string;
    totalPRs: number;
    mergedPRs: number;
    openPRs: number;
    closedPRs: number;
  };
}
```

### GET `/pull-requests/recent`
Get recent pull request activity.

**Query Parameters:**
```typescript
{
  username: string;          // GitHub username
  days?: number;            // Days to look back (default: 30)
  includeStats?: boolean;   // Include detailed stats (default: true)
}
```

### GET `/pull-requests/stats`
Get pull request statistics and analytics.

**Query Parameters:**
```typescript
{
  username: string;          // GitHub username
  period?: 'week' | 'month' | 'quarter' | 'year';  // Time period
  year?: number;            // Specific year (default: current)
}
```

**Response:**
```typescript
{
  period: string;
  stats: {
    totalPRs: number;
    mergedPRs: number;
    averageMergeTime: number;  // in hours
    totalLinesChanged: {
      additions: number;
      deletions: number;
    };
    repositories: {
      name: string;
      prs: number;
      mergedPRs: number;
    }[];
    timeline: {
      date: string;
      prs: number;
      mergedPRs: number;
    }[];
  };
}
```

### GET `/pull-requests/filter`
Advanced filtering of pull requests.

**Query Parameters:**
```typescript
{
  username: string;
  repo?: string;            // Filter by repository name
  language?: string;        // Filter by primary language
  label?: string;           // Filter by label
  dateFrom?: string;        // ISO date string
  dateTo?: string;          // ISO date string
  minAdditions?: number;    // Minimum lines added
  maxAdditions?: number;    // Maximum lines added
}
```

## Profile Endpoints

### GET `/profile/overview`
Get comprehensive developer profile overview.

**Query Parameters:**
```typescript
{
  username: string;          // GitHub username
  includeContributions?: boolean;  // Include contribution graph
  includeOrganizations?: boolean;  // Include organization memberships
}
```

**Response:**
```typescript
{
  profile: {
    username: string;
    name: string;
    bio: string;
    avatar_url: string;
    location: string;
    company: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };
  statistics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalReviews: number;
    contributionStreak: {
      current: number;
      longest: number;
    };
    activeYears: number;
  };
  organizations?: Organization[];
  contributions?: ContributionGraph;
}
```

### GET `/profile/activity`
Get detailed activity timeline.

**Query Parameters:**
```typescript
{
  username: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  includePrivate?: boolean;  // Include private repo activity (if accessible)
}
```

### GET `/profile/languages`
Get programming languages analysis.

**Query Parameters:**
```typescript
{
  username: string;
  includeRepositories?: boolean;  // Include repo breakdown
  minBytes?: number;             // Minimum bytes threshold
}
```

**Response:**
```typescript
{
  languages: {
    [language: string]: {
      bytes: number;
      percentage: number;
      repositories: string[];  // if includeRepositories=true
    };
  };
  totalBytes: number;
  primaryLanguage: string;
  languageCount: number;
}
```

### GET `/profile/contributions`
Get contribution statistics and patterns.

**Query Parameters:**
```typescript
{
  username: string;
  year?: number;            // Specific year
  includePrivate?: boolean; // Include private contributions
}
```

## Repository Endpoints

### GET `/repositories/list`
List user repositories with metadata.

**Query Parameters:**
```typescript
{
  username: string;
  type?: 'all' | 'owner' | 'member';  // Repository type
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  language?: string;                   // Filter by language
  limit?: number;                     // Max 100
}
```

### GET `/repositories/stats`
Get repository statistics overview.

**Query Parameters:**
```typescript
{
  username: string;
  includeLanguages?: boolean;
  includeForks?: boolean;
}
```

**Response:**
```typescript
{
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  languages: { [key: string]: number };
  topRepositories: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    lastUpdated: string;
  }[];
  activity: {
    lastPush: string;
    recentlyUpdated: number;  // repos updated in last 30 days
  };
}
```

## Portfolio Endpoints

### GET `/portfolio/generate`
Generate a complete developer portfolio.

**Query Parameters:**
```typescript
{
  username: string;
  format?: 'json' | 'clean' | 'detailed';
  includePrivate?: boolean;
  timeframe?: 'year' | 'all';
}
```

**Response:** Complete `PortfolioResponse` object with all profile data, contributions, recent activity, and statistics.

### GET `/portfolio/export`
Export portfolio data in various formats.

**Query Parameters:**
```typescript
{
  username: string;
  format: 'json' | 'csv' | 'markdown';
  sections?: string[];  // ['profile', 'prs', 'repos', 'stats']
}
```

## Error Responses

### Standard Error Format
```typescript
{
  error: {
    code: string;         // ERROR_CODE
    message: string;      // Human readable message
    details?: any;        // Additional error details
    correlationId: string; // For debugging
  };
  timestamp: string;
  path: string;
}
```

### Common Error Codes
- `GITHUB_USER_NOT_FOUND`: GitHub user doesn't exist
- `GITHUB_RATE_LIMIT_EXCEEDED`: API rate limit reached
- `GITHUB_TOKEN_INVALID`: Invalid or expired GitHub token
- `VALIDATION_ERROR`: Request validation failed
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `CACHE_ERROR`: Caching system error

## Rate Limiting

### Limits
- **Public API**: 100 requests per minute per IP
- **GitHub API**: 5000 requests per hour (with token)
- **Burst limit**: 10 requests per second

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
X-GitHub-RateLimit-Remaining: 4950
```

## Caching

### Cache Headers
```
Cache-Control: public, max-age=900  // 15 minutes for most endpoints
Cache-Control: public, max-age=3600 // 1 hour for repository data
ETag: "abc123def456"               // For conditional requests
```

### Cache Keys
- Pull requests: `pr_history:{username}:{params_hash}`
- Profile: `profile:{username}:{include_flags}`
- Repository stats: `repo_stats:{username}:{params}`
- Portfolio: `portfolio:{username}:{format}:{timeframe}`

## Examples

### Get Recent Pull Requests
```bash
curl "https://api-github-lmcreans-projects.vercel.app/api/github/v1/pull-requests/recent?username=lmcrean&days=7"
```

### Get Developer Portfolio
```bash
curl "https://api-github-lmcreans-projects.vercel.app/api/github/v1/portfolio/generate?username=lmcrean&format=clean"
```

### Get Language Statistics
```bash
curl "https://api-github-lmcreans-projects.vercel.app/api/github/v1/profile/languages?username=lmcrean&includeRepositories=true"
``` 