import express from 'express';
import cors from 'cors';
import { corsOptions } from './cors';

/**
 * Configure Express middleware for GitHub API server
 */
export function setupMiddleware(app: express.Application): void {
  // CORS middleware
  app.use(cors(corsOptions));
  
  // JSON body parser
  app.use(express.json());
  
  console.log('✅ Middleware configured: CORS and JSON parsing');
} 