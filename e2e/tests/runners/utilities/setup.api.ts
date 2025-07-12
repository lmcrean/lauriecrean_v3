import { APIRequestContext } from '@playwright/test';
import { findActiveApiPort, setApiBaseUrl, getApiBaseUrl, isLocalDevelopmentTest, getBranchApiUrl, PRODUCTION_API_URL } from './config.api';

// Helper function to setup API connection before tests
export async function setupApiConnection(request: APIRequestContext): Promise<void> {
  try {
    const detectedUrl = await findActiveApiPort(request);
    setApiBaseUrl(detectedUrl);
    console.log(`🔧 Using API server at: ${getApiBaseUrl()}`);
  } catch (error) {
    // Check for branch deployment first
    const branchUrl = getBranchApiUrl();
    if (branchUrl) {
      setApiBaseUrl(branchUrl);
      console.log(`🌿 Using branch API from env vars: ${getApiBaseUrl()}`);
    } else if (isLocalDevelopmentTest()) {
      // For local development tests, use localhost
      setApiBaseUrl('http://localhost:3001');
      console.log(`🔧 Local development mode, using local API: ${getApiBaseUrl()}`);
    } else {
      // Fallback to production
      setApiBaseUrl(PRODUCTION_API_URL);
      console.log(`🌍 Fallback to production API: ${getApiBaseUrl()}`);
    }
  }
} 