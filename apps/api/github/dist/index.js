"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const github_1 = require("./github");
const portUtils_1 = require("./utils/portUtils");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration - allow Firebase hosting domains and localhost
const corsOptions = {
    origin: [
        'https://lauriecrean-free-38256.web.app',
        'https://lauriecrean-free-38256.firebaseapp.com',
        // Allow all Firebase preview domains (branch deployments)
        /^https:\/\/lauriecrean-free-38256--.*\.web\.app$/,
        /^https:\/\/lauriecrean-free-38256--.*\.firebaseapp\.com$/,
        // Allow localhost for development
        'http://localhost:3000',
        'http://localhost:3010',
        'http://localhost:3020',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3010',
        'http://127.0.0.1:3020'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Initialize GitHub service
const githubService = new github_1.GitHubService(process.env.GITHUB_TOKEN || '');
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
        const username = req.params.username || req.query.username;
        if (!username) {
            return res.status(400).json({
                error: 'Username is required',
                message: 'Please provide username either as path parameter or query parameter'
            });
        }
        const page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.per_page) || 10;
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
    }
    catch (error) {
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
    }
    catch (error) {
        // Check if it's a 404 error (expected during testing)
        const isNotFound = error.status === 404 ||
            (error instanceof Error && error.message.includes('Not Found'));
        // Check if it's a test case (common test patterns)
        const isTestCase = req.params.owner === 'invalid-owner' ||
            req.params.repo === 'invalid-repo' ||
            parseInt(req.params.pullNumber) === 999999;
        if (isNotFound) {
            if (isTestCase) {
                // Clear message for intentional test cases
                console.log(`🧪 Test case: API endpoint handling 404 (expected): ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
            }
            else {
                // Log simple message for real 404s
                console.log(`🔍 Pull request not found: ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
            }
            res.status(404).json({
                error: 'Not Found',
                message: error instanceof Error ? error.message : 'Pull request not found'
            });
        }
        else {
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
    }
    catch (error) {
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
    (0, portUtils_1.findAvailablePort)(3015, 3020).then(port => {
        app.listen(port, () => {
            console.log(`🚀 GitHub API server running on port ${port} (test mode)`);
        });
    }).catch(error => {
        console.error('❌ Could not find available port:', error);
        process.exit(1);
    });
}
else {
    app.listen(PORT, () => {
        console.log(`🚀 GitHub API server running on port ${PORT}`);
    });
}
//# sourceMappingURL=index.js.map