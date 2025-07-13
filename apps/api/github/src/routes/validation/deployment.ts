import express from 'express';

/**
 * Deployment validation endpoint
 */
export function setupDeploymentValidation(app: express.Application): void {
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

  console.log('✅ Deployment validation route configured: /api/validate/deployment');
} 