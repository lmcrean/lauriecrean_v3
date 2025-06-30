"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const github_1 = require("./github");
const app = (0, express_1.default)();
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://lauriecrean.com'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
// JSON parsing
app.use(express_1.default.json());
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
        const username = req.query.username || process.env.GITHUB_USERNAME || 'lmcrean';
        const limit = Math.min(Number(req.query.limit) || 20, 50);
        console.log(`Fetching ${limit} pull requests for ${username}`);
        const data = await (0, github_1.getPullRequests)(username, limit);
        const response = {
            data,
            meta: {
                username,
                count: data.length
            }
        };
        // Cache for 15 minutes
        res.set('Cache-Control', 'public, max-age=900');
        res.json(response);
    }
    catch (error) {
        console.error('Error in pull-requests endpoint:', error);
        const errorResponse = {
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
        const data = await (0, github_1.getPullRequestDetails)(owner, repo, pullNumber);
        // Cache for 15 minutes
        res.set('Cache-Control', 'public, max-age=900');
        res.json(data);
    }
    catch (error) {
        console.error('Error in pull-request details endpoint:', error);
        const errorResponse = {
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
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    });
});
// For Vercel, export the app
exports.default = app;
// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`GitHub API server running on port ${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
        console.log(`Pull requests: http://localhost:${port}/api/github/pull-requests`);
    });
}
//# sourceMappingURL=index.js.map