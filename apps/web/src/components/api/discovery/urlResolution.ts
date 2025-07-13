/**
 * Main API URL resolution logic
 * Orchestrates the discovery of the correct API endpoint based on environment
 */

import { getBrowserEnv } from '../environment/browserEnv';
import { isDevelopment } from '../environment/detection';
import { getApiPort } from './portDiscovery';
import {
  cleanBranchName,
  extractPotentialBranchNames,
  getSystematicBranchPatterns,
  testApiUrl,
  generateApiUrlPatterns
} from './branchDetection';

/**
 * Dynamic API base URL resolution
 * Determines the correct API endpoint based on environment and deployment context
 */
export const getApiBaseUrl = async (): Promise<string> => {
  const devMode = isDevelopment();
  console.log(`🌐 getApiBaseUrl: isDevelopment=${devMode}, hostname=${typeof window !== 'undefined' ? window.location.hostname : 'undefined'}`);
  
  // QUICK FIX: Check for test environment API override first
  if (typeof window !== 'undefined' && (window as any).__TEST_API_URL__) {
    const testApiUrl = (window as any).__TEST_API_URL__;
    console.log(`🧪 Test API URL override detected: ${testApiUrl}`);
    return testApiUrl;
  }
  
  // Check for branch deployment API URL first (set during build)
  console.log(`🔍 Checking for branch deployment environment variables...`);
  const reactAppUrl = getBrowserEnv('REACT_APP_API_BASE_URL', null);
  const docusaurusUrl = getBrowserEnv('DOCUSAURUS_API_BASE_URL', null);
  
  console.log(`📋 Environment variable check results:`);
  console.log(`   REACT_APP_API_BASE_URL: ${reactAppUrl || 'not set'}`);
  console.log(`   DOCUSAURUS_API_BASE_URL: ${docusaurusUrl || 'not set'}`);
  
  const branchApiUrl = reactAppUrl || docusaurusUrl;
  if (branchApiUrl && branchApiUrl !== 'undefined' && branchApiUrl !== '') {
    console.log(`✅ Branch deployment detected from env vars, using: ${branchApiUrl}`);
    return branchApiUrl;
  }
  
  // If not in development mode, check if this is a branch deployment by parsing the hostname
  if (!devMode && typeof window !== 'undefined') {
    const apiUrl = await tryBranchDeploymentDiscovery();
    if (apiUrl) {
      return apiUrl;
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

/**
 * Try to discover branch deployment API by parsing hostname
 */
async function tryBranchDeploymentDiscovery(): Promise<string | null> {
  const hostname = window.location.hostname;
  console.log(`🔍 Checking hostname for branch deployment: ${hostname}`);
  
  // Check for Firebase branch deployment pattern: project--branch-PR-hash.web.app
  const branchMatch = hostname.match(/^(.+?)--branch-(\d+)-([^.]+)\.web\.app$/);
  console.log(`🧪 Branch regex match result:`, branchMatch);
  
  if (!branchMatch) {
    return null;
  }
  
  const [, projectId, prNumber, branchHash] = branchMatch;
  console.log(`🌿 Detected Firebase branch deployment: PR #${prNumber}, hash: ${branchHash}`);
  
  // Try potential branch names
  const potentialBranchNames = extractPotentialBranchNames(prNumber, branchHash);
  console.log(`🔍 Trying to find branch API for PR #${prNumber}...`);
  
  // Test each potential branch name
  for (const rawBranchName of potentialBranchNames) {
    if (!rawBranchName) continue;
    
    const cleanedBranch = cleanBranchName(rawBranchName);
    const apiUrlPatterns = generateApiUrlPatterns(cleanedBranch);
    
    for (const apiUrl of apiUrlPatterns) {
      console.log(`🧪 Testing branch "${rawBranchName}" → "${cleanedBranch}": ${apiUrl}`);
      
      if (await testApiUrl(apiUrl)) {
        console.log(`✅ Successfully connected to branch API: ${apiUrl}`);
        return apiUrl;
      } else {
        console.log(`❌ Failed to connect to ${apiUrl}`);
      }
    }
  }
  
  // Systematic search as fallback
  console.log(`🔍 Systematic search: trying pattern variations for PR #${prNumber}...`);
  const systematicPatterns = getSystematicBranchPatterns(prNumber);
  
  for (const pattern of systematicPatterns) {
    const apiUrlPatterns = generateApiUrlPatterns(pattern);
    
    for (const apiUrl of apiUrlPatterns) {
      console.log(`🔄 Systematic test: ${apiUrl}`);
      
      if (await testApiUrl(apiUrl, 2000)) {
        console.log(`✅ Found branch API via systematic search: ${apiUrl}`);
        return apiUrl;
      }
    }
  }
  
  console.log(`⚠️ Could not find working branch API for PR #${prNumber}, falling back to production API`);
  console.log(`💡 If you know the branch name, you can set REACT_APP_API_BASE_URL manually`);
  
  return null;
} 