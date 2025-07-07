import axios from 'axios';

// Browser-compatible environment variable access
const getBrowserEnv = (key: string, defaultValue?: string): string | undefined => {
  // Try different ways to access environment variables in browser
  
  // 1. Try window object (if available)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue;
  }
  
  // 2. Try import.meta.env (Vite/modern bundlers)
  if (typeof globalThis !== 'undefined' && 'importMeta' in globalThis) {
    const importMeta = (globalThis as any).importMeta;
    if (importMeta && importMeta.env) {
      return importMeta.env[key] || defaultValue;
    }
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

// API Configuration with dynamic port discovery
// Find the actual API port by trying different ports in order
const findApiPort = async (): Promise<string> => {
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
  const devMode = isDevelopment();
  console.log(`🌐 getApiBaseUrl: isDevelopment=${devMode}, hostname=${typeof window !== 'undefined' ? window.location.hostname : 'undefined'}`);
  
  // Check for branch deployment API URL first (set during build)
  const branchApiUrl = getBrowserEnv('REACT_APP_API_BASE_URL', null) || getBrowserEnv('DOCUSAURUS_API_BASE_URL', null);
  if (branchApiUrl && branchApiUrl !== 'undefined') {
    console.log(`🌿 Branch deployment detected, using: ${branchApiUrl}`);
    return branchApiUrl;
  }
  
  if (devMode) {
    console.log('🔧 Development mode detected, using local API discovery');
    const port = await getApiPort();
    const url = `http://localhost:${port}`;
    console.log(`🎯 Using API URL: ${url}`);
    return url;
  }
  
  const prodUrl = 'https://api-github-main-329000596728.us-central1.run.app';
  console.log(`🌍 Production mode, using: ${prodUrl}`);
  return prodUrl;
};

// For backwards compatibility - will be populated after discovery
// Use a function to ensure proper detection at runtime
const getInitialApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'http://localhost:3015';
    }
  }
  return 'https://api-github-main-329000596728.us-central1.run.app';
};

let API_BASE_URL = getInitialApiUrl();

// Create axios instance with dynamic base URL
const apiClient = axios.create({
  timeout: 30000, // 30 second timeout (increased for GitHub API calls)
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
