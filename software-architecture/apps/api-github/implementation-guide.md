# Implementation Guide - GitHub API Integration

> **Step-by-step guide** for implementing the GitHub portfolio API

## Phase 1: Core Setup (Week 1)

### 1. Project Initialization
```bash
mkdir apps/api-github
cd apps/api-github
npm init -y
npm install express @octokit/rest cors helmet winston zod dotenv
npm install -D typescript @types/express @types/cors @types/node vitest ts-node
```

### 2. Basic Configuration Files

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**`vercel.json`**
```json
{
  "version": 2,
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/github/(.*)",
      "dest": "/src/index.ts"
    }
  ],
  "env": {
    "GITHUB_TOKEN": "@github_token",
    "GITHUB_USERNAME": "lmcrean"
  }
}
```

**`.env.example`**
```bash
# GitHub API Configuration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_USERNAME=lmcrean
GITHUB_API_BASE_URL=https://api.github.com

# Server Configuration  
PORT=3001
NODE_ENV=development
API_BASE_PATH=/api/github

# Rate Limiting & Caching
GITHUB_RATE_LIMIT_PER_HOUR=5000
CACHE_TTL_MINUTES=15
MAX_REQUESTS_PER_MINUTE=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://lauriecrean.com
```

### 3. Core Application Structure

**`src/index.ts`** - Entry Point
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/logging/errorLogger';
import { requestLogger } from './middleware/logging/requestLogger';
import v1Routes from './routes/v1';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Logging middleware
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/github/v1', v1Routes);

// Health check
app.get('/api/github/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const port = config.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    logger.info(`GitHub API server running on port ${port}`);
  });
}

export default app;
```

**`src/config/environment.ts`** - Configuration
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  GITHUB_TOKEN: z.string().min(1, 'GitHub token is required'),
  GITHUB_USERNAME: z.string().default('lmcrean'),
  GITHUB_API_BASE_URL: z.string().url().default('https://api.github.com'),
  API_BASE_PATH: z.string().default('/api/github'),
  GITHUB_RATE_LIMIT_PER_HOUR: z.string().transform(Number).default('5000'),
  CACHE_TTL_MINUTES: z.string().transform(Number).default('15'),
  MAX_REQUESTS_PER_MINUTE: z.string().transform(Number).default('100'),
  ALLOWED_ORIGINS: z.string().optional(),
});

export const config = envSchema.parse(process.env);
```

## Phase 2: GitHub Service Implementation (Week 1-2)

### 4. Core GitHub Service

**`src/services/github/GitHubService.ts`**
```typescript
import { Octokit } from '@octokit/rest';
import { config } from '../../config/environment';
import { logger } from '../../utils/logger';
import { CacheService } from '../cache/CacheService';

export class GitHubService {
  private octokit: Octokit;
  private cache: CacheService;

  constructor() {
    this.octokit = new Octokit({
      auth: config.GITHUB_TOKEN,
      baseUrl: config.GITHUB_API_BASE_URL,
    });
    this.cache = new CacheService();
  }

  async getUserProfile(username: string) {
    const cacheKey = `profile:${username}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      logger.debug(`Cache hit for profile: ${username}`);
      return cached;
    }

    try {
      const { data } = await this.octokit.rest.users.getByUsername({
        username,
      });

      this.cache.set(cacheKey, data, config.CACHE_TTL_MINUTES * 60);
      logger.info(`Fetched profile for user: ${username}`);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch profile for ${username}:`, error);
      throw error;
    }
  }

  async getUserRepositories(username: string, options: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}) {
    const cacheKey = `repos:${username}:${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username,
        type: options.type || 'owner',
        sort: options.sort || 'updated',
        direction: options.direction || 'desc',
        per_page: Math.min(options.per_page || 30, 100),
        page: options.page || 1,
      });

      this.cache.set(cacheKey, data, config.CACHE_TTL_MINUTES * 60);
      return data;
    } catch (error) {
      logger.error(`Failed to fetch repositories for ${username}:`, error);
      throw error;
    }
  }
}
```

### 5. Pull Request Service

**`src/services/github/PullRequestService.ts`**
```typescript
import { GitHubService } from './GitHubService';
import { logger } from '../../utils/logger';

export class PullRequestService extends GitHubService {
  async getUserPullRequests(username: string, options: {
    state?: 'open' | 'closed' | 'all';
    sort?: 'created' | 'updated';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}) {
    try {
      // First get user's repositories
      const repos = await this.getUserRepositories(username, {
        type: 'all',
        per_page: 100
      });

      const allPRs = [];

      // Search for PRs across all repositories
      for (const repo of repos) {
        try {
          const { data: prs } = await this.octokit.rest.pulls.list({
            owner: repo.owner.login,
            repo: repo.name,
            state: options.state || 'all',
            sort: options.sort || 'created',
            direction: options.direction || 'desc',
            per_page: 100
          });

          // Filter PRs by the target user
          const userPRs = prs.filter(pr => pr.user?.login === username);
          allPRs.push(...userPRs);
        } catch (repoError) {
          logger.warn(`Failed to fetch PRs for repo ${repo.full_name}:`, repoError);
          continue;
        }
      }

      // Sort all PRs by creation date
      allPRs.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return options.direction === 'asc' ? dateA - dateB : dateB - dateA;
      });

      // Apply pagination
      const page = options.page || 1;
      const perPage = Math.min(options.per_page || 50, 100);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;

      return {
        data: allPRs.slice(startIndex, endIndex),
        pagination: {
          total: allPRs.length,
          page,
          per_page: perPage,
          hasNext: endIndex < allPRs.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error(`Failed to fetch pull requests for ${username}:`, error);
      throw error;
    }
  }

  async getPullRequestStats(username: string, period: 'week' | 'month' | 'quarter' | 'year' = 'year') {
    try {
      const { data: pullRequests } = await this.getUserPullRequests(username, {
        state: 'all',
        per_page: 100
      });

      const now = new Date();
      const periodStart = new Date();

      switch (period) {
        case 'week':
          periodStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          periodStart.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          periodStart.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          periodStart.setFullYear(now.getFullYear() - 1);
          break;
      }

      const filteredPRs = pullRequests.filter(pr => 
        new Date(pr.created_at) >= periodStart
      );

      const stats = {
        period,
        totalPRs: filteredPRs.length,
        mergedPRs: filteredPRs.filter(pr => pr.merged_at).length,
        openPRs: filteredPRs.filter(pr => pr.state === 'open').length,
        closedPRs: filteredPRs.filter(pr => pr.state === 'closed' && !pr.merged_at).length,
        repositories: this.groupPRsByRepository(filteredPRs),
        timeline: this.generateTimeline(filteredPRs, period)
      };

      return stats;
    } catch (error) {
      logger.error(`Failed to generate PR stats for ${username}:`, error);
      throw error;
    }
  }

  private groupPRsByRepository(prs: any[]) {
    const repoStats = new Map();

    prs.forEach(pr => {
      const repoName = pr.base.repo.full_name;
      if (!repoStats.has(repoName)) {
        repoStats.set(repoName, {
          name: repoName,
          prs: 0,
          mergedPRs: 0
        });
      }

      const stats = repoStats.get(repoName);
      stats.prs++;
      if (pr.merged_at) stats.mergedPRs++;
    });

    return Array.from(repoStats.values());
  }

  private generateTimeline(prs: any[], period: string) {
    // Group PRs by date/period for timeline visualization
    const timeline = new Map();
    
    prs.forEach(pr => {
      const date = new Date(pr.created_at);
      const key = period === 'week' || period === 'month' 
        ? date.toISOString().split('T')[0]  // Daily for week/month
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;  // Monthly for quarter/year

      if (!timeline.has(key)) {
        timeline.set(key, { date: key, prs: 0, mergedPRs: 0 });
      }

      const entry = timeline.get(key);
      entry.prs++;
      if (pr.merged_at) entry.mergedPRs++;
    });

    return Array.from(timeline.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
}
```

## Phase 3: API Routes & Controllers (Week 2)

### 6. Route Implementation

**`src/routes/v1/index.ts`**
```typescript
import { Router } from 'express';
import pullRequestRoutes from './pull-requests';
import profileRoutes from './profile';
import repositoryRoutes from './repositories';
import portfolioRoutes from './portfolio';

const router = Router();

router.use('/pull-requests', pullRequestRoutes);
router.use('/profile', profileRoutes);
router.use('/repositories', repositoryRoutes);
router.use('/portfolio', portfolioRoutes);

export default router;
```

**`src/routes/v1/pull-requests/index.ts`**
```typescript
import { Router } from 'express';
import { PullRequestController } from '../../../controllers/PullRequestController';
import { validateRequest } from '../../../middleware/validation/validateRequest';
import { pullRequestHistorySchema, pullRequestStatsSchema } from '../../../middleware/validation/schemas/pullRequestSchemas';

const router = Router();
const controller = new PullRequestController();

router.get('/history', 
  validateRequest(pullRequestHistorySchema), 
  controller.getHistory.bind(controller)
);

router.get('/recent', 
  controller.getRecent.bind(controller)
);

router.get('/stats', 
  validateRequest(pullRequestStatsSchema),
  controller.getStats.bind(controller)
);

export default router;
```

### 7. Controller Implementation

**`src/controllers/PullRequestController.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { PullRequestService } from '../services/github/PullRequestService';
import { logger } from '../utils/logger';

export class PullRequestController {
  private pullRequestService: PullRequestService;

  constructor() {
    this.pullRequestService = new PullRequestService();
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { username = 'lmcrean', limit = 50, offset = 0, state = 'all' } = req.query;
      
      const page = Math.floor(Number(offset) / Number(limit)) + 1;
      
      const result = await this.pullRequestService.getUserPullRequests(username as string, {
        state: state as any,
        per_page: Number(limit),
        page
      });

      const response = {
        data: result.data,
        pagination: {
          total: result.pagination.total,
          limit: Number(limit),
          offset: Number(offset),
          hasNext: result.pagination.hasNext,
          hasPrev: result.pagination.hasPrev
        },
        meta: {
          username: username as string,
          totalPRs: result.pagination.total,
          // Add more metadata as needed
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching PR history:', error);
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { username = 'lmcrean', period = 'year' } = req.query;

      const stats = await this.pullRequestService.getPullRequestStats(
        username as string, 
        period as any
      );

      res.json(stats);
    } catch (error) {
      logger.error('Error fetching PR stats:', error);
      next(error);
    }
  }

  async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const { username = 'lmcrean', days = 30 } = req.query;
      
      // Implementation for recent PRs within specified days
      const result = await this.pullRequestService.getUserPullRequests(username as string);
      
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days));
      
      const recentPRs = result.data.filter(pr => 
        new Date(pr.created_at) >= daysAgo
      );

      res.json({
        data: recentPRs,
        meta: {
          username: username as string,
          days: Number(days),
          count: recentPRs.length
        }
      });
    } catch (error) {
      logger.error('Error fetching recent PRs:', error);
      next(error);
    }
  }
}
```

## Phase 4: Testing & Deployment (Week 2-3)

### 8. Testing Setup

**`vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
});
```

**Example Test: `src/services/github/__tests__/GitHubService.test.ts`**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitHubService } from '../GitHubService';

// Mock Octokit
vi.mock('@octokit/rest');

describe('GitHubService', () => {
  let service: GitHubService;

  beforeEach(() => {
    service = new GitHubService();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      // Mock implementation
      const mockProfile = {
        login: 'lmcrean',
        name: 'Laurie Crean',
        bio: 'Software Developer',
        public_repos: 50
      };

      // Add test implementation
      const profile = await service.getUserProfile('lmcrean');
      expect(profile).toBeDefined();
    });
  });
});
```

### 9. Deployment Commands

**`package.json` scripts**
```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "vercel:dev": "vercel dev",
    "vercel:deploy": "vercel --prod"
  }
}
```

### 10. Deployment Steps
1. **Set up environment variables** in Vercel dashboard
2. **Deploy to Vercel**: `npm run vercel:deploy`
3. **Test endpoints** with live GitHub data
4. **Set up monitoring** and error tracking
5. **Document API endpoints** for frontend integration

## Next Steps: Frontend Integration
- Create TypeScript types for API responses
- Implement API client in frontend application
- Design portfolio UI components
- Add error handling and loading states
- Implement caching strategy in frontend 