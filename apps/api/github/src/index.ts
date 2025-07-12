import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GitHubService } from './github';
import { findAvailablePort } from './utils/portUtils';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GitHub service
const githubService = new GitHubService(process.env.GITHUB_TOKEN || '');

// Debug logging for authentication status
console.log('🔑 GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('📏 GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);

// Health check endpoint
app.get('/health', (req, res) => {
  const hasGitHubToken = !!process.env.GITHUB_TOKEN;
  const tokenLength = process.env.GITHUB_TOKEN?.length || 0;
  
  res.json({ 
    status: hasGitHubToken ? 'ok' : 'warning',
    timestamp: new Date().toISOString(),
    service: 'api-github',
    github_token: {
      present: hasGitHubToken,
      length: tokenLength,
      valid_format: hasGitHubToken && (process.env.GITHUB_TOKEN?.startsWith('ghp_') || process.env.GITHUB_TOKEN?.startsWith('github_pat_')),
      status: hasGitHubToken ? 'configured' : 'missing'
    }
  });
});

// Port info endpoint
app.get('/api/port-info', (req, res) => {
  const port = parseInt(process.env.PORT || '3000');
  const mode = process.env.NODE_ENV === 'test' ? 'e2e' : 'manual';
  
  res.json({
    port,
    mode,
    timestamp: new Date().toISOString()
  });
});

// Get pull requests for a user - support both path and query parameters
app.get('/api/github/pull-requests/:username?', async (req, res) => {
  try {
    // Support both path parameter (:username) and query parameter (?username=...)
    const username = req.params.username || req.query.username as string;
    
    if (!username) {
      return res.status(400).json({ 
        error: 'Username is required',
        message: 'Please provide username either as path parameter or query parameter' 
      });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    
    const result = await githubService.getPullRequests(username, page, perPage);
    res.json(result);
  } catch (error) {
    console.error('❌ Error in pull requests endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pull requests', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Get details for a specific pull request
app.get('/api/github/pull-requests/:owner/:repo/:pullNumber', async (req, res) => {
  try {
    const { owner, repo, pullNumber } = req.params;
    const prNumber = parseInt(pullNumber);
    
    const result = await githubService.getPullRequestDetails(owner, repo, prNumber);
    res.json(result);
  } catch (error) {
    console.error('❌ Error in pull request details endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pull request details', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Get current GitHub API rate limit status
app.get('/api/github/rate-limit', async (req, res) => {
  try {
    const result = await githubService.getRateLimit();
    res.json(result);
  } catch (error) {
    console.error('❌ Error in rate limit endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to check rate limit', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// 404 handler - must be after all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// If running in test environment, use a different port
if (process.env.NODE_ENV === 'test') {
  findAvailablePort(3015, 3020).then(port => {
    app.listen(port, () => {
      console.log(`🚀 GitHub API server running on port ${port} (test mode)`);
    });
  }).catch(error => {
    console.error('❌ Could not find available port:', error);
    process.exit(1);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 GitHub API server running on port ${PORT}`);
  });
} 