import { APIRequestContext, expect } from '@playwright/test';

// API Configuration - Use localhost for development testing, production URL for production testing
export const POSSIBLE_PORTS = [3001, 3015, 3016, 3017, 3018];
export const TEST_USERNAME = 'lmcrean';
export const PRODUCTION_API_URL = 'https://api-github-main-329000596728.us-central1.run.app';

// Get branch deployment URL if available, otherwise fallback to production
const getBranchApiUrl = (): string | null => {
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
  
  return isLocalDev ? 'http://localhost:3001' : PRODUCTION_API_URL;
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

// Type definitions matching the API
export interface PullRequestResponse {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  html_url: string;
  state: 'open' | 'closed' | 'merged';
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
  };
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface ApiResponse {
  data: PullRequestResponse[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

export interface DetailedPullRequestResponse extends PullRequestResponse {
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  updated_at: string;
  closed_at: string | null;
  draft: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export interface PortInfoResponse {
  port: number;
  mode: string;
  timestamp: string;
}

// Utility functions for common validations
export function validatePullRequestStructure(pr: PullRequestResponse): void {
  // Basic properties
  expect(pr).toHaveProperty('id');
  expect(pr).toHaveProperty('number');
  expect(pr).toHaveProperty('title');
  expect(pr).toHaveProperty('description');
  expect(pr).toHaveProperty('created_at');
  expect(pr).toHaveProperty('merged_at');
  expect(pr).toHaveProperty('html_url');
  expect(pr).toHaveProperty('state');
  expect(pr).toHaveProperty('repository');
  
  // Type validations
  expect(typeof pr.id).toBe('number');
  expect(typeof pr.number).toBe('number');
  expect(typeof pr.title).toBe('string');
  expect(['open', 'closed', 'merged']).toContain(pr.state);
  
  // Repository structure
  expect(pr.repository).toHaveProperty('name');
  expect(pr.repository).toHaveProperty('description');
  expect(pr.repository).toHaveProperty('language');
  expect(pr.repository).toHaveProperty('html_url');
  
  // URL validations
  expect(pr.html_url).toMatch(/^https:\/\/github\.com\//);
  expect(pr.repository.html_url).toMatch(/^https:\/\/github\.com\//);
}

export function validatePaginationStructure(pagination: PaginationMeta): void {
  expect(pagination).toHaveProperty('page');
  expect(pagination).toHaveProperty('per_page');
  expect(pagination).toHaveProperty('total_count');
  expect(pagination).toHaveProperty('total_pages');
  expect(pagination).toHaveProperty('has_next_page');
  expect(pagination).toHaveProperty('has_previous_page');
}

export function validateTimestamp(timestamp: string): void {
  expect(new Date(timestamp).toISOString()).toBe(timestamp);
}

export function validateCacheHeaders(headers: Record<string, string>): void {
  const cacheControl = headers['cache-control'];
  expect(cacheControl).toBe('public, max-age=900');
}

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