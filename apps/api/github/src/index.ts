import express from 'express';
import cors from 'cors';
import { GitHubService } from './github';
import { findAvailablePort } from './utils/portUtils';

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
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get pull requests for a user
app.get('/api/github/pull-requests/:username', async (req, res) => {
  try {
    const { username } = req.params;
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