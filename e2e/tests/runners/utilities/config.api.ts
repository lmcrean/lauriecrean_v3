import { APIRequestContext } from '@playwright/test';

// API Configuration - Use localhost for development testing, production URL for production testing
export const POSSIBLE_PORTS = [3015, 3001, 3016, 3017, 3018];
export const TEST_USERNAME = 'lmcrean';
export const PRODUCTION_API_URL = 'https://api-github-main-329000596728.us-central1.run.app';

// Web/Frontend Configuration
export const DEFAULT_WEB_PORT = 3020;
export const PRODUCTION_WEB_URL = 'https://lauriecrean-free-38256.web.app';

// Test Configuration
export const DEFAULT_API_PORT = 3015;
export const DEFAULT_LOCAL_API_URL = 'http://localhost:3015';
export const DEFAULT_LOCAL_WEB_URL = 'http://localhost:3020';

// Get branch deployment URL if available, otherwise fallback to production
export const getBranchApiUrl = (): string | null => {
  // Check for branch deployment environment variables (set by GitHub Actions or manually)
  const branchApiUrl = process.env.API_DEPLOYMENT_URL || process.env.CLOUD_RUN_URL;
  if (branchApiUrl && branchApiUrl !== 'undefined') {
    console.log(`🌿 Using branch API URL from env: ${branchApiUrl}`);
    return branchApiUrl;
  }
  
  // Check if we can construct from branch info
  const branchName = process.env.GITHUB_HEAD_REF || process.env.BRANCH_NAME;
  if (branchName) {
    const cleanedBranch = branchName
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const constructedUrl = `https://api-github-${cleanedBranch}.us-central1.run.app`;
    console.log(`🏗️ Constructed branch API URL: ${constructedUrl}`);
    return constructedUrl;
  }
  
  return null;
};

// Initialize API_BASE_URL based on environment
const getInitialApiUrl = (): string => {
  // First check for branch deployment URLs
  const branchUrl = getBranchApiUrl();
  if (branchUrl) {
    return branchUrl;
  }
  
  // Check if this is a local development test
  const configFile = process.env.PLAYWRIGHT_CONFIG_FILE || '';
  const isLocalDev = !configFile.includes('prod') && !configFile.includes('production') && 
                    process.env.NODE_ENV !== 'production' &&
                    !process.argv.some(arg => arg.includes('prod.spec') || arg.includes('production'));
  
  return isLocalDev ? 'http://localhost:3015' : PRODUCTION_API_URL;
};

export let API_BASE_URL = getInitialApiUrl();

// Function to detect if we're running local development tests
export function isLocalDevelopmentTest(): boolean {
  const configFile = process.env.PLAYWRIGHT_CONFIG_FILE || '';
  return !configFile.includes('prod') && !configFile.includes('production') && 
         process.env.NODE_ENV !== 'production' &&
         !process.argv.some(arg => arg.includes('prod.spec') || arg.includes('production'));
}

// Function to find the active API server
export async function findActiveApiPort(request: APIRequestContext): Promise<string> {
  // First check for branch deployment URLs (GitHub Actions or manual testing)
  const branchUrl = getBranchApiUrl();
  if (branchUrl) {
    console.log(`🌿 Using branch deployment API: ${branchUrl}`);
    return branchUrl;
  }
  
  // If running local development tests, try localhost ports
  if (isLocalDevelopmentTest()) {
    for (const port of POSSIBLE_PORTS) {
      try {
        const response = await request.get(`http://localhost:${port}/health`);
        if (response.status() === 200) {
          console.log(`✅ Found API server running on port ${port}`);
          return `http://localhost:${port}`;
        }
      } catch (error) {
        // Port not available, try next one
        console.log(`⏭️ Port ${port} not available, trying next...`);
      }
    }
    throw new Error('No API server found on any of the expected ports');
  }
  
  // For production tests without branch deployment, use production API
  console.log(`🌍 Using production API: ${PRODUCTION_API_URL}`);
  return PRODUCTION_API_URL;
}

// Function to set the API base URL
export function setApiBaseUrl(url: string): void {
  API_BASE_URL = url;
}

// Function to get the current API base URL
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// Function to initialize API URL by detecting the active port
export async function initializeApiUrl(request: APIRequestContext): Promise<void> {
  if (isLocalDevelopmentTest()) {
    try {
      const activeApiUrl = await findActiveApiPort(request);
      setApiBaseUrl(activeApiUrl);
      console.log(`🔧 Using API server at: ${activeApiUrl}`);
    } catch (error) {
      console.error('❌ Could not detect API server port:', error.message);
      throw error;
    }
  }
}

// Function to get the appropriate API URL based on environment
export function getApiUrl(): string {
  // Check for branch deployment environment variables
  const branchApiUrl = process.env.API_DEPLOYMENT_URL || process.env.CLOUD_RUN_URL;
  if (branchApiUrl && branchApiUrl !== 'undefined') {
    return branchApiUrl;
  }
  
  // Return production URL for production tests, local for development
  return isLocalDevelopmentTest() ? DEFAULT_LOCAL_API_URL : PRODUCTION_API_URL;
}

// Function to get the appropriate Web URL based on environment
export function getWebUrl(): string {
  // Check for branch deployment environment variables
  const branchWebUrl = process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL;
  if (branchWebUrl && branchWebUrl !== 'undefined') {
    return branchWebUrl;
  }
  
  // Return production URL for production tests, local for development
  return isLocalDevelopmentTest() ? DEFAULT_LOCAL_WEB_URL : PRODUCTION_WEB_URL;
}

// Function to detect if running in production environment
export function isProductionTest(): boolean {
  return !isLocalDevelopmentTest() || 
         Boolean(process.env.WEB_DEPLOYMENT_URL) || 
         Boolean(process.env.FIREBASE_HOSTING_URL) ||
         Boolean(process.env.API_DEPLOYMENT_URL) ||
         Boolean(process.env.CLOUD_RUN_URL);
} 