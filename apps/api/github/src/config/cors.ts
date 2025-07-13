import cors from 'cors';

/**
 * CORS configuration for GitHub API server
 * Allows Firebase hosting domains, preview deployments, and localhost for development
 */

const allowedOrigins = [
  'https://lauriecrean-free-38256.web.app',
  'https://lauriecrean-free-38256.firebaseapp.com',
  'https://lauriecrean.dev',
  // Allow localhost for development
  'http://localhost:3000',
  'http://localhost:3010',
  'http://localhost:3020',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3010',
  'http://127.0.0.1:3020'
];

const allowedPatterns = [
  // Allow all Firebase preview domains (branch deployments)
  /^https:\/\/lauriecrean-free-38256--.*\.web\.app$/,
  /^https:\/\/lauriecrean-free-38256--.*\.firebaseapp\.com$/,
];

export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      console.log('🔓 Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log(`🔍 CORS check for origin: ${origin}`);
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed (exact match)');
      return callback(null, true);
    }
    
    // Check pattern matches
    for (const pattern of allowedPatterns) {
      if (pattern.test(origin)) {
        console.log('✅ Origin allowed (pattern match)');
        return callback(null, true);
      }
    }
    
    console.log('❌ Origin NOT allowed');
    return callback(new Error('CORS policy violation'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}; 