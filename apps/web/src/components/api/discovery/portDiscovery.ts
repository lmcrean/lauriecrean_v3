/**
 * Local development API port discovery
 * Finds the correct API port when running in development mode
 */

import { isManualTestMode } from '../environment/detection';

/**
 * Find the actual API port by trying different ports in order
 * Used for local development when API might be running on different ports
 */
export const findApiPort = async (): Promise<string> => {
  console.log('🔍 Starting API port discovery...');
  
  const basePorts = isManualTestMode()
    ? [3005, 3006, 3007, 3008, 3009] // Try manual ports first
    : [3015, 3016, 3017, 3018, 3019]; // Try e2e ports first
  
  console.log(`🔍 Trying ports: ${basePorts.join(', ')}`);
  
  for (const port of basePorts) {
    try {
      console.log(`🔍 Checking port ${port}...`);
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout (increased)
      });
      
      if (response.ok) {
        console.log(`✅ API discovered on port ${port}`);
        return port.toString();
      } else {
        console.log(`⚠️ Port ${port} responded with status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Port ${port} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Port not responding, try next one
      continue;
    }
  }
  
  // Fallback to default ports if discovery fails
  const fallbackPort = isManualTestMode() ? '3005' : '3015';
  console.warn(`⚠️ API port discovery failed, falling back to port ${fallbackPort}`);
  return fallbackPort;
};

// Cache the discovered port
let cachedApiPort: string | null = null;
let discoveryPromise: Promise<string> | null = null;

/**
 * Get API port with caching
 * Returns cached port if available, otherwise discovers it
 */
export const getApiPort = async (): Promise<string> => {
  if (cachedApiPort) {
    return cachedApiPort;
  }
  
  if (!discoveryPromise) {
    discoveryPromise = findApiPort();
  }
  
  try {
    cachedApiPort = await discoveryPromise;
    return cachedApiPort;
  } catch (error) {
    console.error('API port discovery failed:', error);
    // Fallback to default
    const fallback = isManualTestMode() ? '3005' : '3015';
    cachedApiPort = fallback;
    return fallback;
  }
}; 