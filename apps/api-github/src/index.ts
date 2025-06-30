import express from 'express';
import cors from 'cors';
import { getPullRequests } from './github';
import { ApiResponse, ErrorResponse } from './types';

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://lauriecrean.com'];

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
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    
    console.log(`Fetching ${limit} pull requests for ${username}`);
    
    const data = await getPullRequests(username, limit);
    
    const response: ApiResponse = {
      data,
      meta: {
        username,
        count: data.length
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
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`GitHub API server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`Pull requests: http://localhost:${port}/api/github/pull-requests`);
  });
} 