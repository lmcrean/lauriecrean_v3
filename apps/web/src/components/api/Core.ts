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
    console.log(`🌿 Branch deployment detected from env vars, using: ${branchApiUrl}`);
    return branchApiUrl;
  }
  
  // If not in development mode, check if this is a branch deployment by parsing the hostname
  if (!devMode && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check for Firebase branch deployment pattern: project--branch-PR-hash.web.app
    // Updated regex to handle project names with hyphens (e.g., lauriecrean-free-38256)
    const branchMatch = hostname.match(/^(.+?)--branch-(\d+)-([^.]+)\.web\.app$/);
    if (branchMatch) {
      const [, projectId, prNumber] = branchMatch;
      
      console.log(`🌿 Detected Firebase branch deployment: PR #${prNumber}`);
      
      // Function to clean branch name the same way GitHub Actions does
      // Equivalent to: sed 's/[^a-zA-Z0-9-]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
      const cleanBranchName = (branchName: string): string => {
        return branchName
          .replace(/[^a-zA-Z0-9-]/g, '-')  // Replace non-alphanumeric/hyphen with hyphen
          .toLowerCase()                    // Convert to lowercase
          .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
      };
      
      // Try to determine the actual branch name
      // Common branch naming patterns to try (these will be cleaned)
      const potentialBranchNames = [
        // Try to extract from URL hash if possible
        window.location.search.includes('branch=') ? 
          new URLSearchParams(window.location.search).get('branch') : null,
        
        // Common branch patterns for this type of work
        'bug-fix-gh-actions',
        'fix-gh-actions', 
        'gh-actions-fix',
        'cors-fix',
        'api-fix',
        'deployment-fix',
        'branch-deployment-fix',
        
        // Generic patterns
        `pr-${prNumber}`,
        `branch-${prNumber}`,
        `fix-${prNumber}`,
        
        // Try getting from document title or meta tags
        document.title.includes('branch:') ? 
          document.title.split('branch:')[1]?.trim().split(' ')[0] : null,
      ].filter(Boolean); // Remove null values
      
      console.log(`🔍 Trying to find branch API for PR #${prNumber}...`);
      
      // Try each potential branch name after cleaning it
      for (const rawBranchName of potentialBranchNames) {
        if (!rawBranchName) continue;
        
        const cleanedBranch = cleanBranchName(rawBranchName);
        const apiUrl = `https://api-github-${cleanedBranch}.us-central1.run.app`;
        
        console.log(`🧪 Testing branch "${rawBranchName}" → "${cleanedBranch}": ${apiUrl}`);
        
        try {
          const testResponse = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000) // 3 second timeout per attempt
          });
          
          if (testResponse.ok) {
            console.log(`✅ Successfully connected to branch API: ${apiUrl}`);
            return apiUrl;
          } else {
            console.log(`⚠️ API ${apiUrl} responded with status ${testResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Failed to connect to ${apiUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // If we still can't find it, try a more systematic approach
      // Since integration tests passed, the API must exist - try listing Cloud Run services
      console.log(`🔍 Systematic search: trying pattern variations for PR #${prNumber}...`);
      
      // Try variations of branch names that might result from different branch naming conventions
      const systematicPatterns = [
        `bug-fix-gh-actions`, // Current known branch
        `feature-branch-${prNumber}`,
        `hotfix-${prNumber}`, 
        `bugfix-${prNumber}`,
        `fix-branch-${prNumber}`,
        `dev-branch-${prNumber}`,
        cleanBranchName(`bug/fix-gh-actions-${prNumber}`),
        cleanBranchName(`feature/gh-actions-${prNumber}`),
        cleanBranchName(`fix/cors-issues-${prNumber}`),
      ];
      
      for (const pattern of systematicPatterns) {
        const apiUrl = `https://api-github-${pattern}.us-central1.run.app`;
        
        console.log(`🔄 Systematic test: ${apiUrl}`);
        
        try {
          const testResponse = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(2000) // Shorter timeout for systematic search
          });
          
          if (testResponse.ok) {
            console.log(`✅ Found branch API via systematic search: ${apiUrl}`);
            return apiUrl;
          }
        } catch (error) {
          // Silent fail for systematic search
        }
      }
      
      console.log(`⚠️ Could not find working branch API for PR #${prNumber}, falling back to production API`);
      console.log(`💡 If you know the branch name, you can set REACT_APP_API_BASE_URL manually`);
    }
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
