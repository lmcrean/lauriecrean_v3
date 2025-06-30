# apps/api-github - GitHub Integration API

> **GitHub portfolio API** providing live access to developer pull request history and contribution data

## Overview
A TypeScript Express API that integrates with GitHub's official API to create developer portfolios. Focuses on pull request history, contribution analytics, and developer insights without database storage - optimized for live data retrieval and clean frontend consumption.

## Tech Stack (Vercel Optimized)
- **Express.js** with TypeScript (Vercel Functions compatible)
- **Octokit** for GitHub API integration
- **Zod** for request/response validation  
- **Winston** for structured logging
- **Vitest** for unit testing
- **GitHub REST API** as primary data source
- **Vercel Functions** as deployment target
- **Vercel Edge Network** for global distribution

## File Structure (Vercel Deployment)
```typescript
api-github/
├── package.json           // Dependencies: express, @octokit/rest, typescript
├── tsconfig.json         // TypeScript configuration  
├── vercel.json          // ⚡ Vercel Functions configuration (REQUIRED)
├── vitest.config.ts     // Unit test configuration
├── .env.example         // Environment variables template
├── .vercelignore        // Vercel deployment ignore rules
├── src/
│   ├── index.ts         // Server entry point
│   ├── app.ts          // Express app configuration
│   ├── routes/         // API route definitions
│   │   ├── v1/         // API version 1
│   │   │   ├── index.ts           // Route aggregation
│   │   │   ├── pull-requests/     // Pull request routes
│   │   │   │   ├── index.ts       // PR route exports
│   │   │   │   ├── history.ts     // GET /pull-requests/history
│   │   │   │   ├── stats.ts       // GET /pull-requests/stats
│   │   │   │   ├── recent.ts      // GET /pull-requests/recent
│   │   │   │   ├── filter.ts      // GET /pull-requests/filter
│   │   │   │   └── __tests__/
│   │   │   ├── profile/           // Developer profile routes
│   │   │   │   ├── index.ts       // Profile route exports
│   │   │   │   ├── overview.ts    // GET /profile/overview
│   │   │   │   ├── activity.ts    // GET /profile/activity
│   │   │   │   ├── languages.ts   // GET /profile/languages
│   │   │   │   ├── contributions.ts // GET /profile/contributions
│   │   │   │   └── __tests__/
│   │   │   ├── repositories/      // Repository data routes
│   │   │   │   ├── index.ts       // Repo route exports
│   │   │   │   ├── list.ts        // GET /repositories/list
│   │   │   │   ├── stats.ts       // GET /repositories/stats
│   │   │   │   ├── languages.ts   // GET /repositories/languages
│   │   │   │   └── __tests__/
│   │   │   └── portfolio/         // Portfolio generation routes
│   │   │       ├── index.ts       // Portfolio route exports
│   │   │       ├── generate.ts    // GET /portfolio/generate
│   │   │       ├── export.ts      // GET /portfolio/export
│   │   │       └── __tests__/
│   ├── controllers/     // Request handlers
│   │   ├── PullRequestController.ts   // PR history logic
│   │   ├── ProfileController.ts       // Developer profile logic
│   │   ├── RepositoryController.ts    // Repository data logic
│   │   ├── PortfolioController.ts     // Portfolio generation logic
│   │   └── __tests__/
│   ├── services/        // Business logic services
│   │   ├── github/
│   │   │   ├── GitHubService.ts       // Core GitHub API service
│   │   │   ├── PullRequestService.ts  // PR-specific operations
│   │   │   ├── ProfileService.ts      // Profile data operations
│   │   │   ├── RepositoryService.ts   // Repository operations
│   │   │   ├── ContributionService.ts // Contribution analytics
│   │   │   └── __tests__/
│   │   ├── portfolio/
│   │   │   ├── PortfolioService.ts    // Portfolio generation logic
│   │   │   ├── FormatterService.ts    // Data formatting
│   │   │   ├── AnalyticsService.ts    // Analytics generation
│   │   │   └── __tests__/
│   │   ├── cache/
│   │   │   ├── CacheService.ts        // In-memory caching
│   │   │   ├── RateLimitService.ts    // Rate limit management
│   │   │   └── __tests__/
│   │   └── shared/
│   │       ├── ConfigService.ts       // Configuration management
│   │       ├── ErrorHandlerService.ts // Error handling
│   │       └── __tests__/
│   ├── models/          // TypeScript interfaces and types
│   │   ├── PullRequest.ts        // PR data models
│   │   ├── Profile.ts            // Profile data models
│   │   ├── Repository.ts         // Repository data models
│   │   ├── Portfolio.ts          // Portfolio data models
│   │   ├── GitHubTypes.ts        // GitHub API response types
│   │   └── __tests__/
│   ├── middleware/      // Express middleware
│   │   ├── auth/
│   │   │   ├── githubAuth.ts     // GitHub token validation
│   │   │   └── __tests__/
│   │   ├── validation/
│   │   │   ├── validateRequest.ts // Request validation
│   │   │   ├── schemas/          // Zod validation schemas
│   │   │   │   ├── pullRequestSchemas.ts
│   │   │   │   ├── profileSchemas.ts
│   │   │   │   ├── repositorySchemas.ts
│   │   │   │   └── portfolioSchemas.ts
│   │   │   └── __tests__/
│   │   ├── security/
│   │   │   ├── cors.ts           // CORS configuration
│   │   │   ├── helmet.ts         // Security headers
│   │   │   ├── rateLimiting.ts   // API rate limiting
│   │   │   └── __tests__/
│   │   ├── cache/
│   │   │   ├── cacheMiddleware.ts // Response caching
│   │   │   └── __tests__/
│   │   ├── logging/
│   │   │   ├── requestLogger.ts  // Request logging
│   │   │   ├── errorLogger.ts    // Error logging
│   │   │   └── __tests__/
│   │   └── github/
│   │       ├── githubRateLimit.ts // GitHub API rate limiting
│   │       └── __tests__/
│   ├── config/          // Configuration files
│   │   ├── github.ts            // GitHub API configuration
│   │   ├── cache.ts             // Cache configuration
│   │   ├── cors.ts              // CORS configuration
│   │   ├── environment.ts       // Environment variables
│   │   └── __tests__/
│   └── utils/           // Utility functions
│       ├── logger.ts            // Winston logger configuration
│       ├── errors.ts            // Custom error classes
│       ├── validation.ts        // Validation utilities
│       ├── formatting.ts        // Data formatting utilities
│       ├── constants.ts         // Application constants
│       ├── dateUtils.ts         // Date utility functions
│       └── __tests__/
└── docs/               // API documentation
    ├── openapi.yaml    // OpenAPI specification
    ├── endpoints.md    // Endpoint documentation
    ├── github-api.md   // GitHub API integration guide
    └── examples.md     // Usage examples
```

## Key Endpoints

### Pull Request History
```typescript
GET /v1/pull-requests/history?username=lmcrean&limit=50&offset=0
GET /v1/pull-requests/recent?username=lmcrean&days=30
GET /v1/pull-requests/stats?username=lmcrean&period=year
GET /v1/pull-requests/filter?username=lmcrean&state=merged&repo=odyssey
```

### Developer Profile
```typescript
GET /v1/profile/overview?username=lmcrean
GET /v1/profile/activity?username=lmcrean&period=month
GET /v1/profile/languages?username=lmcrean
GET /v1/profile/contributions?username=lmcrean&year=2024
```

### Repository Data
```typescript
GET /v1/repositories/list?username=lmcrean&type=owner
GET /v1/repositories/stats?username=lmcrean
GET /v1/repositories/languages?username=lmcrean
```

### Portfolio Generation
```typescript
GET /v1/portfolio/generate?username=lmcrean&format=json
GET /v1/portfolio/export?username=lmcrean&format=clean
```

## Response Models

### Pull Request Response
```typescript
interface PullRequestResponse {
  id: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
  merged_at: string | null;
  repository: {
    name: string;
    full_name: string;
    language: string;
    stars: number;
  };
  author: {
    login: string;
    avatar_url: string;
  };
  stats: {
    additions: number;
    deletions: number;
    changed_files: number;
    commits: number;
  };
  labels: string[];
  reviewers: string[];
}
```

### Portfolio Response
```typescript
interface PortfolioResponse {
  profile: {
    username: string;
    name: string;
    bio: string;
    avatar_url: string;
    location: string;
    company: string;
    blog: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  contributions: {
    total_commits: number;
    total_prs: number;
    total_reviews: number;
    total_issues: number;
    streak_days: number;
    languages: { [key: string]: number };
  };
  recent_activity: PullRequestResponse[];
  top_repositories: RepositoryResponse[];
  activity_timeline: ActivityEvent[];
}
```

## Configuration & Environment

### Environment Variables
```bash
# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx          # GitHub Personal Access Token
GITHUB_USERNAME=lmcrean                         # Default username
GITHUB_API_BASE_URL=https://api.github.com     # GitHub API base URL

# Server Configuration
PORT=3001                                       # Server port
NODE_ENV=development                            # Environment
API_BASE_PATH=/api/github                       # API base path

# Rate Limiting
GITHUB_RATE_LIMIT_PER_HOUR=5000                # GitHub API rate limit
CACHE_TTL_MINUTES=15                           # Cache TTL in minutes
MAX_REQUESTS_PER_MINUTE=100                    # API rate limiting

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://lauriecrean.com  # Allowed CORS origins
```

## Caching Strategy

### In-Memory Cache
- **Pull request data**: 15 minutes TTL
- **Profile data**: 30 minutes TTL
- **Repository data**: 1 hour TTL
- **Contribution stats**: 6 hours TTL

### Rate Limit Management
- **GitHub API**: 5000 requests/hour with token
- **Graceful degradation** for rate limit exceeded
- **Intelligent caching** to minimize API calls
- **Request batching** for multiple data points

## Error Handling

### GitHub API Errors
- **Rate limit exceeded**: Return cached data + retry headers
- **Token invalid**: Clear error message for configuration
- **User not found**: 404 with helpful message
- **Repository not accessible**: Skip with warning

### API Response Errors
- **Validation errors**: 400 with detailed field errors
- **Server errors**: 500 with correlation ID for debugging
- **Timeout errors**: 504 with retry suggestions

## Vercel Deployment Configuration

### Required Vercel Files

**`vercel.json`** - Primary deployment configuration
```json
{
  "version": 2,
  "name": "api-github",
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "env": {
    "GITHUB_TOKEN": "@github_token",
    "GITHUB_USERNAME": "lmcrean",
    "NODE_ENV": "production"
  },
  "routes": [
    {
      "src": "/api/github/(.*)",
      "dest": "/src/index.ts"
    },
    {
      "src": "/health",
      "dest": "/src/index.ts"
    }
  ],
  "headers": [
    {
      "source": "/api/github/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=900"
        }
      ]
    }
  ]
}
```

**`.vercelignore`** - Exclude files from deployment
```
node_modules
*.test.ts
*.test.js
coverage/
.env
.env.local
src/**/__tests__/
dist/
```

### Vercel Environment Variables Setup
```bash
# Set via Vercel Dashboard or CLI
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_USERNAME production  
vercel env add ALLOWED_ORIGINS production
```

### Deployment Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Development preview
vercel dev

# Deploy to preview
vercel

# Deploy to production  
vercel --prod

# Set environment variables
vercel env add GITHUB_TOKEN
```

### Vercel Function Optimization
- **Runtime**: Node.js 18.x for optimal performance
- **Memory**: 1024MB for GitHub API processing
- **Duration**: 30s timeout for complex operations
- **Edge caching**: 15-minute cache for API responses

### Vercel Deployment URLs
```bash
# Production deployment
https://api-github-lmcreans-projects.vercel.app

# Preview deployments (per branch)  
https://api-github-git-[branch]-lmcreans-projects.vercel.app

# Development
http://localhost:3001 (vercel dev)
```

### Vercel-Specific Performance Optimizations
- **Cold start optimization**: Minimal dependencies in entry point
- **Memory management**: Efficient caching to stay within limits
- **Response streaming**: For large payload responses
- **Edge caching**: Aggressive caching headers for GitHub data
- **Function splitting**: Separate functions for heavy operations

### Future Enhancements
- **Vercel Edge Functions** for faster response times
- **GraphQL support** for more efficient queries
- **Webhook integration** for real-time updates
- **Advanced analytics** with Vercel Analytics
- **Multi-user support** with Vercel KV storage
- **Redis caching** via Vercel integrations 