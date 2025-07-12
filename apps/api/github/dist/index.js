"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const github_1 = require("./github");
const portUtils_1 = require("./utils/portUtils");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize GitHub service
const githubService = new github_1.GitHubService(process.env.GITHUB_TOKEN || '');
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
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.per_page) || 10;
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
    }
    catch (error) {
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