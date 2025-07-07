import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Function to clean branch names the same way GitHub Actions does
const cleanBranchName = (branchName: string): string => {
  return branchName
    .replace(/[^a-zA-Z0-9-]/g, '-')  // Replace non-alphanumeric/hyphen with hyphen
    .toLowerCase()                    // Convert to lowercase
    .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
};

// Function to get the web deployment URL
const getWebDeploymentUrl = (): string => {
  // 1. Check if GitHub Actions provided the URL directly
  const directWebUrl = process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL;
  if (directWebUrl) {
    console.log(`🌐 Using direct web URL: ${directWebUrl}`);
    return directWebUrl;
  }

  // 2. Try to construct from branch info
  const branchName = process.env.GITHUB_HEAD_REF || process.env.BRANCH_NAME;
  const prNumber = process.env.GITHUB_EVENT_NUMBER || process.env.PR_NUMBER;
  
  if (branchName && prNumber) {
    const cleanedBranch = cleanBranchName(branchName);
    // Firebase hosting branch deployment pattern
    const constructedUrl = `https://lauriecrean--branch-${prNumber}-${cleanedBranch}.web.app`;
    console.log(`🏗️ Constructed web URL from branch "${branchName}" (PR #${prNumber}): ${constructedUrl}`);
    return constructedUrl;
  }

  // 3. Fallback to production
  const fallbackUrl = 'https://lauriecrean-free-38256.web.app';
  console.log(`⚠️ Could not determine branch web URL, falling back to: ${fallbackUrl}`);
  return fallbackUrl;
};

// Function to get the API deployment URL
const getApiDeploymentUrl = (): string => {
  // 1. Check if GitHub Actions provided the URL directly
  const directApiUrl = process.env.API_DEPLOYMENT_URL || process.env.CLOUD_RUN_URL;
  if (directApiUrl) {
    console.log(`🔗 Using direct API URL: ${directApiUrl}`);
    return directApiUrl;
  }

  // 2. Try to construct from branch info
  const branchName = process.env.GITHUB_HEAD_REF || process.env.BRANCH_NAME;
  
  if (branchName) {
    const cleanedBranch = cleanBranchName(branchName);
    // Cloud Run branch deployment pattern
    const constructedUrl = `https://api-github-${cleanedBranch}.us-central1.run.app`;
    console.log(`🏗️ Constructed API URL from branch "${branchName}": ${constructedUrl}`);
    return constructedUrl;
  }

  // 3. Fallback to production
  const fallbackUrl = 'https://api-github-main-329000596728.us-central1.run.app';
  console.log(`⚠️ Could not determine branch API URL, falling back to: ${fallbackUrl}`);
  return fallbackUrl;
};

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Global setup and teardown hooks
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'utils/global-teardown.ts'),
  
  // Set environment variables for tests to access API URL
  use: {
    // Make API URL available to tests
    extraHTTPHeaders: {
      'X-Test-API-Base-URL': getApiDeploymentUrl(),
    },
  },
  
  // Only using Safari as specified in custom instructions
  projects: [
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: getWebDeploymentUrl(),
        // Record videos for debugging if tests fail
        video: 'on-first-retry',
        // Set a longer timeout for network operations in production
        navigationTimeout: 60000,
        // Keep screenshot on failure
        screenshot: 'only-on-failure'
      },
    },
  ],
  
  // No need for webServer as we're testing production deployments
}); 