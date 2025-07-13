/**
 * Environment detection utilities
 * Simple, reliable environment detection
 */

/**
 * Manual test mode detection
 * Checks if the app is running in manual test mode via URL or window object
 */
export const isManualTestMode = (): boolean => {
  if (typeof window !== 'undefined') {
    // Check URL parameters for test mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') {
      return true;
    }
    
    // Check for test environment flag
    if ((window as any).__TEST_MODE__) {
      return true;
    }
  }
  
  return false;
};

/**
 * Development mode detection
 * Determines if the app is running in development mode (localhost)
 */
export const isDevelopment = (): boolean => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  }
  
  return false;
}; 