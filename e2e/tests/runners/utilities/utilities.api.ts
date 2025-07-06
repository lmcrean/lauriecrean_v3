import { APIRequestContext, expect } from '@playwright/test';

// API Configuration - Use localhost for development testing, production URL for production testing
export const POSSIBLE_PORTS = [3001, 3015, 3016, 3017, 3018];
export const TEST_USERNAME = 'lmcrean';
export const PRODUCTION_API_URL = 'https://api-github-329000596728.us-central1.run.app';

// Initialize API_BASE_URL based on environment
const getInitialApiUrl = (): string => {
  const configFile = process.env.PLAYWRIGHT_CONFIG_FILE || '';
  const isProd = configFile.includes('prod') || configFile.includes('production') || 
                 process.env.NODE_ENV === 'production' ||
                 process.argv.some(arg => arg.includes('prod.spec') || arg.includes('production'));
  
  return isProd ? PRODUCTION_API_URL : 'http://localhost:3001';
};

export let API_BASE_URL = getInitialApiUrl();

// Function to detect if we're running production tests
export function isProductionTest(): boolean {
  // Check if we're using the production Playwright config
  const configFile = process.env.PLAYWRIGHT_CONFIG_FILE || '';
  return configFile.includes('prod') || configFile.includes('production') || 
         process.env.NODE_ENV === 'production' ||
         process.argv.some(arg => arg.includes('prod.spec') || arg.includes('production'));
}

// Function to find the active API server
export async function findActiveApiPort(request: APIRequestContext): Promise<string> {
  // If running production tests, use production API URL
  if (isProductionTest()) {
    console.log(`🌍 Production test detected, using production API: ${PRODUCTION_API_URL}`);
    return PRODUCTION_API_URL;
  }
  
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
    if (isProductionTest()) {
      // For production tests, always use the production URL even if detection fails
      setApiBaseUrl(PRODUCTION_API_URL);
      console.log(`🌍 Production test mode, using production API: ${getApiBaseUrl()}`);
    } else {
      console.log(`⚠️ Could not auto-detect API server, using default: ${getApiBaseUrl()}`);
    }
  }
} 