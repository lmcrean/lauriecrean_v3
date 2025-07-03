import { test, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import { 
  setupApiConnection, 
  getApiBaseUrl, 
  TEST_USERNAME,
  ApiResponse,
  DetailedPullRequestResponse,
  validatePullRequestStructure,
  validatePaginationStructure,
  validateCacheHeaders
} from './runners/operations';

// Global test metrics
let testMetrics = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  networkCalls: 0,
  apiErrors: 0,
  startTime: Date.now()
};

let logger: E2ELogger;

test.describe('Pull Request Feed API Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    logger = new E2ELogger('PR-FEED-API');
    logger.logInfo('🚀 Starting Pull Request Feed API Test Suite', 'test-suite');
    
    await setupApiConnection(request);
    testMetrics.startTime = Date.now();
    
    logger.logInfo(`🔧 Using API server at: ${getApiBaseUrl()}`, 'setup');
  });

  test.afterAll(async () => {
    const duration = Date.now() - testMetrics.startTime;
    
    logger.logInfo('📊 TEST SUMMARY REPORT', 'summary');
    logger.logInfo(`✅ Tests Passed: ${testMetrics.passedTests}`, 'summary');
    logger.logInfo(`❌ Tests Failed: ${testMetrics.failedTests}`, 'summary');
    logger.logInfo(`📡 Network Calls: ${testMetrics.networkCalls}`, 'summary');
    logger.logInfo(`🚨 API Errors: ${testMetrics.apiErrors}`, 'summary');
    logger.logInfo(`⏱️ Total Duration: ${duration}ms`, 'summary');
    logger.logInfo(`🎯 Success Rate: ${Math.round((testMetrics.passedTests / testMetrics.totalTests) * 100)}%`, 'summary');
    
    console.log('\n=== PULL REQUEST FEED API TEST SUMMARY ===');
    console.log(`✅ Tests Passed: ${testMetrics.passedTests}`);
    console.log(`❌ Tests Failed: ${testMetrics.failedTests}`);
    console.log(`📡 Network Calls: ${testMetrics.networkCalls}`);
    console.log(`🚨 API Errors: ${testMetrics.apiErrors}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`🎯 Success Rate: ${Math.round((testMetrics.passedTests / testMetrics.totalTests) * 100)}%`);
    console.log('============================================\n');
  });

  test.beforeEach(async () => {
    testMetrics.totalTests++;
  });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status === 'passed') {
      testMetrics.passedTests++;
      logger.logInfo(`✅ ${testInfo.title}`, 'test-result');
    } else {
      testMetrics.failedTests++;
      logger.logError(`❌ ${testInfo.title}`, 'test-result', { error: testInfo.error });
    }
  });

  test('should fetch pull requests list with default parameters', async ({ request }) => {
    logger.logInfo('🔍 Testing pull requests list with default parameters', 'test');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}`);
    testMetrics.networkCalls++;
    
    if (response.status() !== 200) {
      testMetrics.apiErrors++;
    }
    
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
    
    logger.logInfo(`📋 Successfully fetched ${data.data.length} pull requests`, 'api-response');
    
    // If we have data, validate pull request structure
    if (data.data.length > 0) {
      const pr = data.data[0];
      validatePullRequestStructure(pr);
      logger.logInfo(`📄 Validated PR structure for "${pr.title}"`, 'validation');
    }
  });

  test('should handle pagination parameters correctly', async ({ request }) => {
    logger.logInfo('📄 Testing pagination parameters', 'test');
    
    const page = 1;
    const perPage = 5;
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&page=${page}&per_page=${perPage}`);
    testMetrics.networkCalls++;
    
    if (response.status() !== 200) {
      testMetrics.apiErrors++;
    }
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Validate pagination reflects our parameters
    expect(data.meta.pagination.page).toBe(page);
    expect(data.meta.pagination.per_page).toBe(perPage);
    expect(data.data.length).toBeLessThanOrEqual(perPage);
    expect(data.meta.count).toBeLessThanOrEqual(perPage);
    
    logger.logInfo(`📊 Pagination working: page=${page}, per_page=${perPage}, returned=${data.data.length}`, 'pagination');
  });

  test('should enforce per_page maximum limit', async ({ request }) => {
    logger.logInfo('🔒 Testing per_page maximum limit enforcement', 'test');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=100`);
    testMetrics.networkCalls++;
    
    if (response.status() !== 200) {
      testMetrics.apiErrors++;
    }
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Should be capped at 50
    expect(data.meta.pagination.per_page).toBe(50);
    expect(data.data.length).toBeLessThanOrEqual(50);
    
    logger.logInfo(`🛡️ Per-page limit enforced: requested=100, actual=${data.meta.pagination.per_page}`, 'validation');
  });

  test('should fetch detailed pull request data', async ({ request }) => {
    logger.logInfo('🔍 Testing detailed pull request data fetch', 'test');
    
    // First get a pull request from the list to test details
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    testMetrics.networkCalls++;
    
    if (listResponse.status() !== 200) {
      testMetrics.apiErrors++;
    }
    
    expect(listResponse.status()).toBe(200);
    
    const listData: ApiResponse = await listResponse.json();
    
    if (listData.data.length === 0) {
      logger.logInfo('⏭️ No pull requests available to test details endpoint', 'skip');
      return;
    }
    
    const testPR = listData.data[0];
    
    // Extract owner and repo from HTML URL
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    logger.logInfo(`📝 Testing detailed data for PR #${testPR.number} from ${owner}/${repo}`, 'detail-test');
    
    const detailResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/${owner}/${repo}/${testPR.number}`);
    testMetrics.networkCalls++;
    
    if (detailResponse.status() !== 200) {
      testMetrics.apiErrors++;
    }
    
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
    
    logger.logInfo(`📊 Detailed PR stats: ${detailData.commits} commits, ${detailData.additions}+ ${detailData.deletions}- lines, ${detailData.changed_files} files`, 'pr-stats');
  });

  test('should handle API errors gracefully', async ({ request }) => {
    logger.logInfo('🚨 Testing API error handling', 'test');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/invalid-user/invalid-repo/999`);
    testMetrics.networkCalls++;
    
    // This should be a 404 or similar error
    expect(response.status()).toBeGreaterThanOrEqual(400);
    testMetrics.apiErrors++; // This is expected
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    
    logger.logInfo(`🛡️ Error handling working: ${response.status()} - ${data.error}`, 'error-handling');
  });
});
