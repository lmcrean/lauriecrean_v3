import express from 'express';
import { GitHubService } from '../github';

/**
 * Validation and diagnostic endpoints
 */
export function setupValidationRoutes(app: express.Application, githubService: GitHubService): void {
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

  console.log('✅ Validation routes configured: /api/validate/cors, /api/validate/environment, /api/validate/deployment, /api/validate/integration');
} 