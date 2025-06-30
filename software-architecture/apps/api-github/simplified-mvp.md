# GitHub API - Simplified MVP

> **Minimal viable API** for pull request portfolio feed
>
> aims to be a simple MVP for the github api.

## What We Actually Need (Phase 1)

### Single Core Endpoint
```typescript
GET /api/github/pull-requests?username=lmcrean&limit=20
```

**Response:**
```typescript
{
  data: {
    id: number;
    title: string;
    created_at: string;
    merged_at: string | null;
    repository: {
      name: string;
      description: string;  // From GitHub API, no scraping needed!
      language: string;
      html_url: string;
    };
    html_url: string;
    state: 'open' | 'closed' | 'merged';
  }[];
  meta: {
    username: string;
    count: number;
  };
}
```

## Simplified File Structure
```typescript
api-github/
├── package.json
├── vercel.json          // Just basic Vercel config
├── src/
│   ├── index.ts         // Single entry point
│   ├── github.ts        // GitHub API calls
│   └── types.ts         // TypeScript interfaces
```

## Implementation (< 150 lines total)

**`src/index.ts`** - Complete API
```typescript
import express from 'express';
import cors from 'cors';
import { getPullRequests } from './github';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://lauriecrean.com']
}));

app.get('/api/github/pull-requests', async (req, res) => {
  try {
    const username = req.query.username || 'lmcrean';
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    
    const data = await getPullRequests(username as string, limit);
    
    res.json({
      data,
      meta: {
        username,
        count: data.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch pull requests',
      message: error.message 
    });
  }
});

export default app;
```

**`src/github.ts`** - GitHub API Logic
```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function getPullRequests(username: string, limit: number) {
  // Get user's repositories
  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
    type: 'owner',
    sort: 'updated',
    per_page: 100
  });

  const allPRs = [];

  // Get PRs from each repo
  for (const repo of repos.slice(0, 20)) { // Limit repo search for rate limiting
    try {
      const { data: prs } = await octokit.rest.pulls.list({
        owner: repo.owner.login,
        repo: repo.name,
        state: 'all',
        sort: 'created',
        direction: 'desc',
        per_page: 10
      });

      // Filter PRs by the target user and add repo info
      const userPRs = prs
        .filter(pr => pr.user?.login === username)
        .map(pr => ({
          id: pr.id,
          title: pr.title,
          created_at: pr.created_at,
          merged_at: pr.merged_at,
          html_url: pr.html_url,
          state: pr.merged_at ? 'merged' : pr.state,
          repository: {
            name: repo.name,
            description: repo.description, // No scraping needed!
            language: repo.language,
            html_url: repo.html_url
          }
        }));

      allPRs.push(...userPRs);
    } catch (error) {
      console.warn(`Failed to fetch PRs for ${repo.name}:`, error.message);
      continue;
    }
  }

  // Sort by creation date and limit
  return allPRs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
```

**`vercel.json`** - Minimal Config
```json
{
  "functions": {
    "src/index.ts": { "maxDuration": 30 }
  },
  "routes": [
    { "src": "/api/github/(.*)", "dest": "/src/index.ts" }
  ]
}
```

## Why This is Better for MVP

### ✅ **Much Simpler**
- ~150 lines vs 1000+ lines
- 3 files vs 50+ files  
- 1 endpoint vs 12+ endpoints

### ✅ **Still Gets Project Descriptions**
- Uses `repo.description` from GitHub API
- **No scraping needed** - GitHub provides this data
- More reliable than web scraping

### ✅ **Same Functionality**
- Clean PR feed for portfolio
- Project info included
- Ready for frontend integration

## Free Implementation - Yes, Totally Viable! 

### **GitHub API (Free Tier)**
- 5,000 requests/hour with personal token
- Your portfolio site will use maybe 10-50 requests/day
- **Cost: $0**

### **Vercel (Hobby Plan)**
- 100 serverless function invocations/day
- Your API will use 5-20 invocations/day
- **Cost: $0**

### **Rate Limiting Strategy**
- Cache responses for 15 minutes
- Most visitors see cached data
- Well within free limits

## Phase 2 Extensions (Later)
When you want to expand, add:
- Contribution stats endpoint
- Repository analytics  
- Better error handling
- More sophisticated caching

But for now, this simple version gives you everything you need! 