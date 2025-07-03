import axios from 'axios';

// Browser-compatible environment variable access
const getBrowserEnv = (key: string, defaultValue?: string): string | undefined => {
  // Try different ways to access environment variables in browser
  
  // 1. Try window object (if available)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue;
  }
  
  // 2. Try import.meta.env (Vite/modern bundlers)
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return (import.meta.env as any)[key] || defaultValue;
  }
  
  // 3. Try process.env only if in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // 4. Fallback to default
  return defaultValue;
};

// Browser-safe environment checks
const isManualTestMode = (): boolean => {
  const testMode = getBrowserEnv('REACT_APP_TEST_MODE');
  return testMode === 'manual';
};

const isDevelopment = (): boolean => {
  const nodeEnv = getBrowserEnv('NODE_ENV', 'production');
  return nodeEnv === 'development' || nodeEnv === 'dev';
};

// API Configuration with dynamic port discovery
// Find the actual API port by trying different ports in order
const findApiPort = async (): Promise<string> => {
  const basePorts = isManualTestMode()
    ? [3005, 3006, 3007, 3008, 3009] // Try manual ports first
    : [3015, 3016, 3017, 3018, 3019]; // Try e2e ports first
  
  for (const port of basePorts) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(1000) // 1 second timeout
      });
      
      if (response.ok) {
        console.log(`🔍 API discovered on port ${port}`);
        return port.toString();
      }
    } catch (error) {
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

const getApiPort = async (): Promise<string> => {
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

// Dynamic API base URL
const getApiBaseUrl = async (): Promise<string> => {
  if (isDevelopment()) {
    const port = await getApiPort();
    return `http://localhost:${port}`;
  }
  return 'https://api-github-lmcrean-lmcreans-projects.vercel.app';
};

// For backwards compatibility - will be populated after discovery
let API_BASE_URL = isDevelopment()
  ? 'http://localhost:3015' // Default fallback
  : 'https://api-github-lmcrean-lmcreans-projects.vercel.app';

// Create axios instance with dynamic base URL
const apiClient = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for dynamic base URL and common headers
apiClient.interceptors.request.use(
  async (config) => {
    // Set dynamic base URL if not already set
    if (!config.baseURL) {
      config.baseURL = await getApiBaseUrl();
    }
    
    // You can add common headers, authentication tokens, etc. here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response patterns
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error patterns
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (error.response?.status === 404) {
      error.message = error.response?.data?.message || 'Resource not found.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export { apiClient };

// Export API base URL for reference (legacy - use getApiBaseUrl for dynamic)
export { API_BASE_URL };

// Export dynamic functions
export { getApiBaseUrl, getApiPort };

// Default export
export default apiClient;
