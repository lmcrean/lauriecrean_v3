import { test, expect } from '@playwright/test';
import { 
  getApiBaseUrl, 
  initializeApiUrl,
  TEST_USERNAME,
  ApiResponse,
  DetailedPullRequestResponse,
  validatePullRequestStructure,
  validatePaginationStructure,
  validateCacheHeaders
} from '../../runners/utilities/utilities.api';
import { ObservabilityRunner } from '../../runners/setup/observability-runner';

const observability = new ObservabilityRunner('Pull Request Feed API');

test.describe('Pull Request Feed API Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
    await initializeApiUrl(request);
  });

  test.afterAll(async () => {
    await observability.teardown();
  });

  test.beforeEach(async () => {
    observability.incrementTestCount();
  });

  test.afterEach(async ({ }, testInfo) => {
    observability.recordTestResult(testInfo.title, testInfo.status === 'passed', testInfo.error);
  });

  test('should fetch pull requests list with default parameters', async ({ request }) => {
    observability.logTestStart('🔍 Testing pull requests list with default parameters');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Check cache headers
    validateCacheHeaders(response.headers());
    
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
    validatePaginationStructure(data.meta.pagination);
    
    observability.logNetworkActivity(`📋 Successfully fetched ${data.data.length} pull requests`);
    
    // If we have data, validate pull request structure
    if (data.data.length > 0) {
      const pr = data.data[0];
      validatePullRequestStructure(pr);
      observability.logTestInfo(`📄 Validated PR structure for "${pr.title}"`);
    }
  });

  test('should handle pagination parameters correctly', async ({ request }) => {
    observability.logTestStart('📄 Testing pagination parameters');
    
    const page = 1;
    const perPage = 5;
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&page=${page}&per_page=${perPage}`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Validate pagination reflects our parameters
    expect(data.meta.pagination.page).toBe(page);
    expect(data.meta.pagination.per_page).toBe(perPage);
    expect(data.data.length).toBeLessThanOrEqual(perPage);
    expect(data.meta.count).toBeLessThanOrEqual(perPage);
    
    observability.logTestInfo(`📊 Pagination working: page=${page}, per_page=${perPage}, returned=${data.data.length}`);
  });

  test('should enforce per_page maximum limit', async ({ request }) => {
    observability.logTestStart('🔒 Testing per_page maximum limit enforcement');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=100`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Should be capped at 50
    expect(data.meta.pagination.per_page).toBe(50);
    expect(data.data.length).toBeLessThanOrEqual(50);
    
    observability.logTestInfo(`🛡️ Per-page limit enforced: requested=100, actual=${data.meta.pagination.per_page}`);
  });

  test('should fetch detailed pull request data', async ({ request }) => {
    observability.logTestStart('🔍 Testing detailed pull request data fetch');
    
    // First get a pull request from the list to test details
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    observability.recordNetworkCall(listResponse.status() === 200);
    
    expect(listResponse.status()).toBe(200);
    
    const listData: ApiResponse = await listResponse.json();
    
    if (listData.data.length === 0) {
      observability.logTestInfo('⏭️ No pull requests available to test details endpoint');
      return;
    }
    
    const testPR = listData.data[0];
    
    // Extract owner and repo from HTML URL
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    observability.logTestInfo(`📝 Testing detailed data for PR #${testPR.number} from ${owner}/${repo}`);
    
    const detailResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/${owner}/${repo}/${testPR.number}`);
    observability.recordNetworkCall(detailResponse.status() === 200);
    
    expect(detailResponse.status()).toBe(200);
    
    // Check cache headers
    validateCacheHeaders(detailResponse.headers());
    
    const detailData: DetailedPullRequestResponse = await detailResponse.json();
    
    // Should have all basic PR fields
    expect(detailData.id).toBe(testPR.id);
    expect(detailData.number).toBe(testPR.number);
    expect(detailData.title).toBe(testPR.title);
    
    // Should have additional detailed fields
    expect(detailData).toHaveProperty('author');
    expect(detailData).toHaveProperty('commits');
    expect(detailData).toHaveProperty('additions');
    expect(detailData).toHaveProperty('deletions');
    expect(detailData).toHaveProperty('changed_files');
    
    observability.logTestInfo(`📊 Detailed PR stats: ${detailData.commits} commits, ${detailData.additions}+ ${detailData.deletions}- lines, ${detailData.changed_files} files`);
  });

  test('should handle API errors gracefully', async ({ request }) => {
    observability.logTestStart('🚨 Testing API error handling');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/invalid-user/invalid-repo/999`);
    observability.recordNetworkCall(response.status() >= 400); // Error response is expected
    
    // This should be a 404 or similar error
    expect(response.status()).toBeGreaterThanOrEqual(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    
    observability.logNetworkActivity(`🛡️ Error handling working: ${response.status()} - ${data.error}`);
  });
});
