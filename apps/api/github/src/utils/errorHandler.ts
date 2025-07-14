import express from 'express';

/**
 * Error handling utilities
 */

// 404 handler - must be after all other routes
export function setup404Handler(app: express.Application): void {
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`
    });
  });
  
  console.log('✅ 404 handler configured');
} 