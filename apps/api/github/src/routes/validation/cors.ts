import express from 'express';

/**
 * CORS validation endpoint
 */
export function setupCorsValidation(app: express.Application): void {
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

  console.log('✅ CORS validation route configured: /api/validate/cors');
} 