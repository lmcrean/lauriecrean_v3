import { test, expect } from '@playwright/test';
import { 
  getApiBaseUrl, 
  TEST_USERNAME,
  DetailedPullRequestResponse,
  ErrorResponse,
  validateCacheHeaders,
  setupApiConnection
} from './runners/operations.api';
import { ObservabilityRunner } from './runners/setup/observability-runner';
import { PullRequestDetailApiRunner, PullRequestDetailConfig } from './runners/pull-request/pull-request-detail.api';
import { E2ELogger } from '@lauriecrean/observability';

const observability = new ObservabilityRunner('Pull Request Detail API');
const logger = new E2ELogger();
const apiRunner = new PullRequestDetailApiRunner(logger);

test.describe('Pull Request Detail API Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
    await setupApiConnection(request);
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

  test('should fetch detailed pull request information', async ({ request }) => {
    observability.logTestStart('🔍 Testing pull request detail endpoint');
    
    // First, get a valid pull request from the list to use for testing
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    observability.recordNetworkCall(listResponse.status() === 200);
    
    expect(listResponse.status()).toBe(200);
    
    const listData = await listResponse.json();
    
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
    
    // Test the detailed PR endpoint using the runner
    const config: PullRequestDetailConfig = {
      owner,
      repo,
      number: testPR.number,
      timeout: 30000
    };
    
    const result = await apiRunner.fetchPullRequestDetails(request, config);
    observability.recordNetworkCall(result.success);
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    
    const detailData = result.data!;
    
    // Validate that this is the same PR
    expect(detailData.id).toBe(testPR.id);
    expect(detailData.number).toBe(testPR.number);
    expect(detailData.title).toBe(testPR.title);
    
    observability.logTestInfo(`📊 PR Details: ${detailData.commits} commits, ${detailData.additions}+ ${detailData.deletions}- lines, ${detailData.changed_files} files`);
  });

  test('should validate detailed pull request structure', async ({ request }) => {
    observability.logTestStart('🔍 Testing pull request detail structure validation');
    
    // Get a valid pull request
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    observability.recordNetworkCall(listResponse.status() === 200);
    
    expect(listResponse.status()).toBe(200);
    
    const listData = await listResponse.json();
    
    if (listData.data.length === 0) {
      observability.logTestInfo('⏭️ No pull requests available for structure validation');
      return;
    }
    
    const testPR = listData.data[0];
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    // Fetch detailed PR data
    const config: PullRequestDetailConfig = {
      owner,
      repo,
      number: testPR.number,
      timeout: 30000
    };
    
    const result = await apiRunner.fetchPullRequestDetails(request, config);
    observability.recordNetworkCall(result.success);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    // Validate structure using the runner
    const isValid = await apiRunner.validatePullRequestDetailStructure(result.data!);
    expect(isValid).toBe(true);
    
    observability.logTestInfo('✅ Pull request detail structure validation passed');
  });

  test('should include required detailed fields', async ({ request }) => {
    observability.logTestStart('🔍 Testing required detailed fields presence');
    
    // Get a valid pull request
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    observability.recordNetworkCall(listResponse.status() === 200);
    
    expect(listResponse.status()).toBe(200);
    
    const listData = await listResponse.json();
    
    if (listData.data.length === 0) {
      observability.logTestInfo('⏭️ No pull requests available for detailed fields test');
      return;
    }
    
    const testPR = listData.data[0];
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    // Fetch detailed PR data
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/${owner}/${repo}/${testPR.number}`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Check cache headers
    validateCacheHeaders(response.headers());
    
    const detailData: DetailedPullRequestResponse = await response.json();
    
    // Validate that detailed fields are present that are NOT in the list view
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
    expect(detailData.author.html_url).toMatch(/^https:\/\/github\.com\//);
    
    // Validate numeric fields
    expect(typeof detailData.commits).toBe('number');
    expect(typeof detailData.additions).toBe('number');
    expect(typeof detailData.deletions).toBe('number');
    expect(typeof detailData.changed_files).toBe('number');
    expect(typeof detailData.comments).toBe('number');
    
    // Validate that numeric fields are non-negative
    expect(detailData.commits).toBeGreaterThanOrEqual(0);
    expect(detailData.additions).toBeGreaterThanOrEqual(0);
    expect(detailData.deletions).toBeGreaterThanOrEqual(0);
    expect(detailData.changed_files).toBeGreaterThanOrEqual(0);
    expect(detailData.comments).toBeGreaterThanOrEqual(0);
    
    observability.logTestInfo(`📊 Detailed stats validated: ${detailData.commits} commits, ${detailData.additions}+ ${detailData.deletions}- lines, ${detailData.changed_files} files, ${detailData.comments} comments`);
  });

  test('should handle invalid pull request number', async ({ request }) => {
    observability.logTestStart('🚨 Testing invalid pull request number handling');
    
    const config: Partial<PullRequestDetailConfig> = {
      owner: TEST_USERNAME,
      repo: 'some-repo',
      number: 999999, // Very unlikely to exist
      timeout: 30000
    };
    
    const result = await apiRunner.testErrorHandling(request, config);
    observability.recordNetworkCall(result.expectedError);
    
    expect(result.success).toBe(true);
    expect(result.expectedError).toBe(true);
    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.error).toBeDefined();
    expect(result.error?.error).toBeDefined();
    
    observability.logNetworkActivity(`✅ Error handling working: ${result.status} - ${result.error?.error}`);
  });

  test('should handle invalid repository', async ({ request }) => {
    observability.logTestStart('🚨 Testing invalid repository handling');
    
    const config: Partial<PullRequestDetailConfig> = {
      owner: 'invalid-user',
      repo: 'invalid-repo',
      number: 1,
      timeout: 30000
    };
    
    const result = await apiRunner.testErrorHandling(request, config);
    observability.recordNetworkCall(result.expectedError);
    
    expect(result.success).toBe(true);
    expect(result.expectedError).toBe(true);
    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.error).toBeDefined();
    
    observability.logNetworkActivity(`✅ Error handling working: ${result.status} - ${result.error?.error}`);
  });

  test('should handle malformed pull request number', async ({ request }) => {
    observability.logTestStart('🚨 Testing malformed pull request number handling');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/${TEST_USERNAME}/some-repo/invalid-number`);
    observability.recordNetworkCall(response.status() === 400);
    
    expect(response.status()).toBe(400);
    
    const errorData: ErrorResponse = await response.json();
    expect(errorData).toHaveProperty('error');
    expect(errorData).toHaveProperty('message');
    expect(errorData.error).toBe('Invalid pull request number');
    
    observability.logNetworkActivity(`✅ Malformed number handling: ${response.status()} - ${errorData.error}`);
  });

  test('should have consistent response time', async ({ request }) => {
    observability.logTestStart('⏱️ Testing pull request detail response time');
    
    // Get a valid pull request
    const listResponse = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=1`);
    observability.recordNetworkCall(listResponse.status() === 200);
    
    expect(listResponse.status()).toBe(200);
    
    const listData = await listResponse.json();
    
    if (listData.data.length === 0) {
      observability.logTestInfo('⏭️ No pull requests available for performance test');
      return;
    }
    
    const testPR = listData.data[0];
    const urlParts = testPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    // Measure response time
    const start = Date.now();
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/${owner}/${repo}/${testPR.number}`);
    const responseTime = Date.now() - start;
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Detail endpoint should be reasonably fast (under 10 seconds)
    expect(responseTime).toBeLessThan(10000);
    
    observability.logNetworkActivity(`⚡ PR detail response time: ${responseTime}ms`);
  });
});
