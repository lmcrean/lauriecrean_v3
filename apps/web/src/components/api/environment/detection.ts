/**
 * Environment detection utilities
 * Determines development mode, test mode, and other environment states
 */

import { getBrowserEnv } from './browserEnv';

/**
 * Manual test mode detection
 * Checks if the app is running in manual test mode
 */
export const isManualTestMode = (): boolean => {
  return getBrowserEnv('REACT_APP_TEST_MODE', 'false') === 'true';
};

/**
 * Development mode detection
 * Determines if the app is running in development mode
 */
export const isDevelopment = (): boolean => {
  // Check if we're running on localhost (most reliable for development)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return true;
    }
  }
  
  // Check environment variables as secondary
  const nodeEnv = getBrowserEnv('NODE_ENV', 'production');
  return nodeEnv === 'development' || nodeEnv === 'dev';
}; 