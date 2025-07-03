import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file explicitly
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Debug environment loading
console.log('=== Environment Debug ===');
console.log('Working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('.env path:', path.join(__dirname, '..', '.env'));
console.log('GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);
if (process.env.GITHUB_TOKEN) {
  console.log('GITHUB_TOKEN starts with:', process.env.GITHUB_TOKEN.substring(0, 10) + '...');
}
console.log('=========================');

import express from 'express';
import cors from 'cors';
import { getPullRequests, getPullRequestDetails } from './github';
import { ApiResponse, ErrorResponse } from './types';

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3010', 'https://lauriecrean.com', 'https://www.lauriecrean.dev'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// JSON parsing
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'api-github'
  });
});

// Main pull requests endpoint
app.get('/api/github/pull-requests', async (req, res) => {
  try {
    const username = (req.query.username as string) || process.env.GITHUB_USERNAME || 'lmcrean';
    
    // Parse pagination parameters
    const page = Math.max(1, Number(req.query.page) || 1);
    const perPage = Math.min(Math.max(1, Number(req.query.per_page) || 20), 50); // Max 50 per page
    
    console.log(`Fetching page ${page} (${perPage} PRs per page) for ${username}`);
    
    const result = await getPullRequests(username, page, perPage);
    
    const response: ApiResponse = {
      data: result.pullRequests,
      meta: {
        username,
        count: result.pullRequests.length,
        pagination: result.pagination
      }
    };

    // Cache for 15 minutes
    res.set('Cache-Control', 'public, max-age=900');
    res.json(response);
    
  } catch (error) {
    console.error('Error in pull-requests endpoint:', error);
    
    const errorResponse: ErrorResponse = {
      error: 'Failed to fetch pull requests',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    res.status(500).json(errorResponse);
  }
});

// Detailed pull request endpoint
app.get('/api/github/pull-requests/:owner/:repo/:number', async (req, res) => {
  try {
    const { owner, repo, number } = req.params;
    const pullNumber = parseInt(number, 10);
    
    if (isNaN(pullNumber) || pullNumber <= 0) {
      return res.status(400).json({
        error: 'Invalid pull request number',
        message: 'Pull request number must be a positive integer'
      });
    }
    
    console.log(`Fetching detailed PR #${pullNumber} from ${owner}/${repo}`);
    
    const data = await getPullRequestDetails(owner, repo, pullNumber);
    
    // Cache for 15 minutes
    res.set('Cache-Control', 'public, max-age=900');
    res.json(data);
    
  } catch (error) {
    console.error('Error in pull-request details endpoint:', error);
    
    const errorResponse: ErrorResponse = {
      error: 'Failed to fetch pull request details',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    // Return 404 for not found, 500 for other errors
    const statusCode = error instanceof Error && error.message.includes('Not Found') ? 404 : 500;
    res.status(statusCode).json(errorResponse);
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

// For Vercel, export the app
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3015;
  app.listen(port, () => {
    console.log(`GitHub API server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`Pull requests: http://localhost:${port}/api/github/pull-requests`);
  });
} 