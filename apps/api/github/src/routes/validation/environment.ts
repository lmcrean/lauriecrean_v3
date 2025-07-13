import express from 'express';

/**
 * Environment validation endpoint
 */
export function setupEnvironmentValidation(app: express.Application): void {
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

  console.log('✅ Environment validation route configured: /api/validate/environment');
} 