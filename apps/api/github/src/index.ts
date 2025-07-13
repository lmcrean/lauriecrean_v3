import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GitHubService } from './github';
import { findAvailablePort } from './utils/portUtils';

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS configuration - allow Firebase hosting domains and localhost
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      console.log('🔓 Allowing request with no origin');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'https://lauriecrean-free-38256.web.app',
      'https://lauriecrean-free-38256.firebaseapp.com',
      'https://lauriecrean.dev',
      // Allow localhost for development
      'http://localhost:3000',
      'http://localhost:3010',
      'http://localhost:3020',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3010',
      'http://127.0.0.1:3020'
    ];
    
    const allowedPatterns = [
      // Allow all Firebase preview domains (branch deployments)
      /^https:\/\/lauriecrean-free-38256--.*\.web\.app$/,
      /^https:\/\/lauriecrean-free-38256--.*\.firebaseapp\.com$/,
    ];
    
    console.log(`🔍 CORS check for origin: ${origin}`);
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed (exact match)');
      return callback(null, true);
    }
    
    // Check pattern matches
    for (const pattern of allowedPatterns) {
      if (pattern.test(origin)) {
        console.log('✅ Origin allowed (pattern match)');
        return callback(null, true);
      }
    }
    
    console.log('❌ Origin NOT allowed');
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize GitHub service
const githubService = new GitHubService(process.env.GITHUB_TOKEN || '');

// Enhanced debug logging for authentication and environment
console.log('=== 🔍 ENVIRONMENT DEBUGGING ===');
console.log('🔑 GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('📏 GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
console.log('=====================================');

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
    let perPage = parseInt(req.query.per_page as string) || 10;
    
    // Validate page parameter
    if (page < 1) {
      return res.status(400).json({ 
        error: 'Invalid page parameter',
        message: 'Page must be a positive integer' 
      });
    }
    
    // Validate and limit per_page parameter to prevent rate limiting
    if (perPage < 1) {
      return res.status(400).json({ 
        error: 'Invalid per_page parameter',
        message: 'per_page must be a positive integer' 
      });
    }
    
    // Cap per_page at 50 to prevent rate limiting and performance issues
    const maxPerPage = 50;
    if (perPage > maxPerPage) {
      perPage = maxPerPage;
      console.log(`⚠️ per_page parameter ${req.query.per_page} capped at ${maxPerPage} for user ${username}`);
    }
    
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
    // Check if it's a 404 error (expected during testing)
    const isNotFound = (error as any).status === 404 || 
                      (error instanceof Error && error.message.includes('Not Found'));
    
    // Check if it's a test case (common test patterns)
    const isTestCase = req.params.owner === 'invalid-owner' || 
                      req.params.repo === 'invalid-repo' || 
                      parseInt(req.params.pullNumber) === 999999;
    
    if (isNotFound) {
      if (isTestCase) {
        // Clear message for intentional test cases
        console.log(`🧪 Test case: API endpoint handling 404 (expected): ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
      } else {
        // Log simple message for real 404s
        console.log(`🔍 Pull request not found: ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
      }
      
      res.status(404).json({ 
        error: 'Not Found', 
        message: error instanceof Error ? error.message : 'Pull request not found' 
      });
    } else {
      // Log full error details for unexpected errors (only for non-test cases)
      if (!isTestCase) {
        console.error('❌ Error in pull request details endpoint:', error);
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch pull request details', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
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

// CORS validation endpoint
app.get('/api/validate/cors', (req, res) => {
  const origin = req.headers.origin;
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cors_check: {
      origin: origin || 'no-origin',
      user_agent: req.headers['user-agent'] || 'unknown',
      method: req.method,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        'access-control-request-method': req.headers['access-control-request-method'],
        'access-control-request-headers': req.headers['access-control-request-headers']
      }
    },
    message: 'CORS validation successful - if you can see this, CORS is working!'
  });
});

// Environment validation endpoint
app.get('/api/validate/environment', (req, res) => {
  const requiredEnvVars = [
    'GITHUB_TOKEN',
    'NODE_ENV',
    'PORT'
  ];
  
  const envStatus = requiredEnvVars.reduce((acc, envVar) => {
    const value = process.env[envVar];
    acc[envVar] = {
      present: !!value,
      value: envVar === 'GITHUB_TOKEN' ? (value ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 'missing') : value,
      valid: envVar === 'GITHUB_TOKEN' ? (value?.startsWith('ghp_') || value?.startsWith('github_pat_')) : !!value
    };
    return acc;
  }, {} as Record<string, any>);
  
  const allValid = Object.values(envStatus).every(env => env.valid);
  
  res.json({
    status: allValid ? 'ok' : 'warning',
    timestamp: new Date().toISOString(),
    environment: envStatus,
    deployment_info: {
      cloud_run_region: process.env.CLOUD_RUN_REGION || 'unknown',
      service_name: process.env.K_SERVICE || 'unknown',
      revision: process.env.K_REVISION || 'unknown'
    }
  });
});

// Deployment validation endpoint
app.get('/api/validate/deployment', (req, res) => {
  const deployment = {
    service_name: process.env.K_SERVICE || 'unknown',
    revision: process.env.K_REVISION || 'unknown',
    configuration: process.env.K_CONFIGURATION || 'unknown',
    port: process.env.PORT || '3000',
    region: process.env.CLOUD_RUN_REGION || 'unknown',
    instance_id: process.env.INSTANCE_ID || 'unknown'
  };
  
  // Check if this looks like a branch deployment
  const isBranchDeployment = deployment.service_name && deployment.service_name.includes('api-github-') && deployment.service_name !== 'api-github-main';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    deployment,
    branch_deployment: {
      detected: isBranchDeployment,
      service_pattern: deployment.service_name || 'unknown',
      expected_frontend_url: isBranchDeployment ? 
        `Frontend should connect to: ${req.protocol}://${req.get('host')}` : 
        'Not a branch deployment'
    },
    url_info: {
      full_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      host: req.get('host'),
      protocol: req.protocol,
      headers: {
        host: req.headers.host,
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-forwarded-for': req.headers['x-forwarded-for']
      }
    }
  });
});

// Full integration test endpoint
app.get('/api/validate/integration', async (req, res) => {
  const results = {
    cors: 'ok',
    environment: 'checking...',
    github_api: 'checking...',
    deployment: 'ok'
  };
  
  try {
    // Test GitHub API connection
    const rateLimit = await githubService.getRateLimit();
    results.github_api = rateLimit ? 'ok' : 'failed';
    
    // Test environment variables
    const hasGitHubToken = !!process.env.GITHUB_TOKEN;
    const tokenValid = hasGitHubToken && (process.env.GITHUB_TOKEN?.startsWith('ghp_') || process.env.GITHUB_TOKEN?.startsWith('github_pat_'));
    results.environment = hasGitHubToken && tokenValid ? 'ok' : 'failed';
    
    const allPassed = Object.values(results).every(result => result === 'ok');
    
    res.json({
      status: allPassed ? 'ok' : 'warning',
      timestamp: new Date().toISOString(),
      integration_tests: results,
      summary: allPassed ? 'All integration tests passed!' : 'Some integration tests failed',
      next_steps: allPassed ? 
        'API is ready for frontend integration' : 
        'Check individual validation endpoints for details'
    });
    
  } catch (error) {
    results.github_api = 'failed';
    res.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      integration_tests: results,
      error: error instanceof Error ? error.message : 'Unknown error',
      summary: 'Integration test failed'
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