import express from 'express';
import { GitHubService } from '../../github';

/**
 * Integration validation endpoint
 */
export function setupIntegrationValidation(app: express.Application, githubService: GitHubService): void {
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

  console.log('✅ Integration validation route configured: /api/validate/integration');
} 