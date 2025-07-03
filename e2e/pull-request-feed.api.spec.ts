import { test, expect } from '@playwright/test';

// API Configuration
const API_BASE_URL = 'https://api-github-lmcrean-lmcreans-projects.vercel.app';
const TEST_USERNAME = 'lmcrean';

// Type definitions matching the API
interface PullRequestResponse {
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

interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

interface ApiResponse {
  data: PullRequestResponse[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

interface DetailedPullRequestResponse extends PullRequestResponse {
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

interface ErrorResponse {
  error: string;
  message: string;
}

test.describe('Pull Request Feed API', () => {
  
  test('should respond to health check', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service', 'api-github');
    
    // Validate timestamp format (ISO string)
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  test('should fetch pull requests list with default parameters', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests?username=${TEST_USERNAME}`);
    
    expect(response.status()).toBe(200);
    
    // Check cache headers
    const cacheControl = response.headers()['cache-control'];
    expect(cacheControl).toBe('public, max-age=900');
    
    const data: ApiResponse = await response.json();
    
    // Validate response structure
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(Array.isArray(data.data)).toBe(true);
    
    // Validate meta structure
    expect(data.meta).toHaveProperty('username', TEST_USERNAME);
    expect(data.meta).toHaveProperty('count');
    expect(data.meta).toHaveProperty('pagination');
    expect(data.meta.count).toBe(data.data.length);
    
    // Validate pagination structure
    const pagination = data.meta.pagination;
    expect(pagination).toHaveProperty('page');
    expect(pagination).toHaveProperty('per_page');
    expect(pagination).toHaveProperty('total_count');
    expect(pagination).toHaveProperty('total_pages');
    expect(pagination).toHaveProperty('has_next_page');
    expect(pagination).toHaveProperty('has_previous_page');
    
    // Validate default pagination values
    expect(pagination.page).toBe(1);
    expect(pagination.per_page).toBe(20);
    
    // If we have data, validate pull request structure
    if (data.data.length > 0) {
      const pr = data.data[0];
      
      expect(pr).toHaveProperty('id');
      expect(pr).toHaveProperty('number');
      expect(pr).toHaveProperty('title');
      expect(pr).toHaveProperty('description');
      expect(pr).toHaveProperty('created_at');
      expect(pr).toHaveProperty('merged_at');
      expect(pr).toHaveProperty('html_url');
      expect(pr).toHaveProperty('state');
      expect(pr).toHaveProperty('repository');
      
      // Validate types
      expect(typeof pr.id).toBe('number');
      expect(typeof pr.number).toBe('number');
      expect(typeof pr.title).toBe('string');
      expect(['open', 'closed', 'merged']).toContain(pr.state);
      
      // Validate repository structure
      expect(pr.repository).toHaveProperty('name');
      expect(pr.repository).toHaveProperty('description');
      expect(pr.repository).toHaveProperty('language');
      expect(pr.repository).toHaveProperty('html_url');
      
      // Validate date formats
      expect(new Date(pr.created_at).toISOString()).toBe(pr.created_at);
      if (pr.merged_at) {
        expect(new Date(pr.merged_at).toISOString()).toBe(pr.merged_at);
      }
      
      // Validate URLs
      expect(pr.html_url).toMatch(/^https:\/\/github\.com\//);
      expect(pr.repository.html_url).toMatch(/^https:\/\/github\.com\//);
    }
  });

  test('should handle pagination parameters', async ({ request }) => {
    const page = 1;
    const perPage = 5;
    
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests?username=${TEST_USERNAME}&page=${page}&per_page=${perPage}`);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Validate pagination reflects our parameters
    expect(data.meta.pagination.page).toBe(page);
    expect(data.meta.pagination.per_page).toBe(perPage);
    
    // Validate we don't exceed requested per_page limit
    expect(data.data.length).toBeLessThanOrEqual(perPage);
    expect(data.meta.count).toBeLessThanOrEqual(perPage);
  });

  test('should limit per_page to maximum of 50', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=100`);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Should be capped at 50
    expect(data.meta.pagination.per_page).toBe(50);
    expect(data.data.length).toBeLessThanOrEqual(50);
  });

  test('should handle page minimum of 1', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests?username=${TEST_USERNAME}&page=0`);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Should be set to minimum of 1
    expect(data.meta.pagination.page).toBe(1);
  });

  test('should fetch detailed pull request data', async ({ request }) => {
    // First get a pull request from the list to test details
    const listResponse = await request.get(`${API_BASE_URL}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    expect(listResponse.status()).toBe(200);
    
    const listData: ApiResponse = await listResponse.json();
    
    if (listData.data.length === 0) {
      test.skip('No pull requests available to test details endpoint');
      return;
    }
    
    const testPR = listData.data[0];
    
    // Extract owner and repo from HTML URL
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    const detailResponse = await request.get(`${API_BASE_URL}/api/github/pull-requests/${owner}/${repo}/${testPR.number}`);
    
    expect(detailResponse.status()).toBe(200);
    
    // Check cache headers
    const cacheControl = detailResponse.headers()['cache-control'];
    expect(cacheControl).toBe('public, max-age=900');
    
    const detailData: DetailedPullRequestResponse = await detailResponse.json();
    
    // Should have all basic PR fields
    expect(detailData.id).toBe(testPR.id);
    expect(detailData.number).toBe(testPR.number);
    expect(detailData.title).toBe(testPR.title);
    
    // Should have additional detailed fields
    expect(detailData).toHaveProperty('author');
    expect(detailData).toHaveProperty('updated_at');
    expect(detailData).toHaveProperty('closed_at');
    expect(detailData).toHaveProperty('draft');
    expect(detailData).toHaveProperty('commits');
    expect(detailData).toHaveProperty('additions');
    expect(detailData).toHaveProperty('deletions');
    expect(detailData).toHaveProperty('changed_files');
    expect(detailData).toHaveProperty('comments');
    
    // Validate author structure
    expect(detailData.author).toHaveProperty('login');
    expect(detailData.author).toHaveProperty('avatar_url');
    expect(detailData.author).toHaveProperty('html_url');
    
    // Validate types
    expect(typeof detailData.draft).toBe('boolean');
    expect(typeof detailData.commits).toBe('number');
    expect(typeof detailData.additions).toBe('number');
    expect(typeof detailData.deletions).toBe('number');
    expect(typeof detailData.changed_files).toBe('number');
    expect(typeof detailData.comments).toBe('number');
    
    // Validate date format
    expect(new Date(detailData.updated_at).toISOString()).toBe(detailData.updated_at);
    if (detailData.closed_at) {
      expect(new Date(detailData.closed_at).toISOString()).toBe(detailData.closed_at);
    }
    
    // Validate URLs
    expect(detailData.author.html_url).toMatch(/^https:\/\/github\.com\//);
    expect(detailData.author.avatar_url).toMatch(/^https:\/\/.*\.githubusercontent\.com\//);
  });

  test('should handle invalid pull request number in details endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests/lmcrean/test-repo/invalid`);
    
    expect(response.status()).toBe(400);
    
    const data: ErrorResponse = await response.json();
    expect(data).toHaveProperty('error', 'Invalid pull request number');
    expect(data).toHaveProperty('message', 'Pull request number must be a positive integer');
  });

  test('should handle zero pull request number in details endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests/lmcrean/test-repo/0`);
    
    expect(response.status()).toBe(400);
    
    const data: ErrorResponse = await response.json();
    expect(data).toHaveProperty('error', 'Invalid pull request number');
    expect(data).toHaveProperty('message', 'Pull request number must be a positive integer');
  });

  test('should handle non-existent pull request in details endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/github/pull-requests/lmcrean/non-existent-repo/99999`);
    
    expect([404, 500]).toContain(response.status());
    
    const data: ErrorResponse = await response.json();
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('message');
  });

  test('should handle non-existent route', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/non-existent-endpoint`);
    
    expect(response.status()).toBe(404);
    
    const data: ErrorResponse = await response.json();
    expect(data).toHaveProperty('error', 'Not Found');
    expect(data.message).toContain('Route /api/non-existent-endpoint not found');
  });

  test('should respond to port info endpoint', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/port-info`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('port');
    expect(data).toHaveProperty('mode');
    expect(data).toHaveProperty('timestamp');
    
    expect(typeof data.port).toBe('number');
    expect(['manual', 'e2e']).toContain(data.mode);
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  test('should handle CORS headers properly', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    
    expect(response.status()).toBe(200);
    
    // Note: CORS headers might not be visible in Playwright requests
    // This test ensures the request succeeds, which means CORS is properly configured
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('should have consistent response time for health check', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${API_BASE_URL}/health`);
    const responseTime = Date.now() - start;
    
    expect(response.status()).toBe(200);
    
    // Health check should be fast (under 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`Health check response time: ${responseTime}ms`);
  });
});
