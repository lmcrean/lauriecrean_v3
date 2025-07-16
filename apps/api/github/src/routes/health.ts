import express from 'express';

/**
 * Health and system information endpoints
 */
export function setupHealthRoutes(app: express.Application): void {
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

  console.log('✅ Health routes configured: /health, /api/port-info');
} 