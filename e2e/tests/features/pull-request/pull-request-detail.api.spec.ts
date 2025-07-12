import { test, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import { PullRequestDetailApiRunner } from '../../runners/pull-request/pull-request-detail.api';
import { setupApiConnection, setApiBaseUrl, getApiUrl } from '../../runners/utilities/utilities.api';

const logger = new E2ELogger();

test.describe('PR Detail API Tests', () => {
  let runner: PullRequestDetailApiRunner;

  test.beforeAll(async ({ request }) => {
    runner = new PullRequestDetailApiRunner(logger);
    
    // Set API URL using centralized configuration
    const apiUrl = getApiUrl();
    setApiBaseUrl(apiUrl);
    logger.logInfo(`🔧 Configured API URL: ${apiUrl}`, 'test');
  });

  test('should fetch PR list and then fetch PR details', async ({ request }) => {
    logger.logInfo('🚀 Starting PR Detail API Test', 'test');
    
    // Get the API URL from centralized configuration
    const apiUrl = getApiUrl();
    
    logger.logInfo(`🔗 Using API URL: ${apiUrl}`, 'test');
    
    // First fetch PR list to get a real PR
    const prListResponse = await request.get(`${apiUrl}/api/github/pull-requests?username=lmcrean&page=1&per_page=5`);
    expect(prListResponse.status()).toBe(200);
    
    const prListData = await prListResponse.json();
    expect(prListData.data.length).toBeGreaterThan(0);
    
    // Get details for the first PR
    const firstPR = prListData.data[0];
    const urlParts = firstPR.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    // Use runner to fetch PR details
    const result = await runner.fetchPullRequestDetails(request, {
      owner,
      repo,
      number: firstPR.number,
      timeout: 30000
    });
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    // Validate the structure
    if (result.data) {
      const isValid = await runner.validatePullRequestDetailStructure(result.data);
      expect(isValid).toBe(true);
    }
  });

  test('should handle specific PR #33 detail request', async ({ request }) => {
    logger.logInfo('🚀 Testing specific PR #33 detail request', 'test');
    
    const result = await runner.fetchPullRequestDetails(request, {
      owner: 'lmcrean',
      repo: 'developer-portfolio',
      number: 33,
      timeout: 30000
    });
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.number).toBe(33);
    
    if (result.data) {
      logger.logInfo(`✅ PR #33 detail data: ${result.data.commits} commits, +${result.data.additions}/-${result.data.deletions} changes`, 'test');
    }
  });

  test('should handle invalid PR gracefully', async ({ request }) => {
    logger.logInfo('🚨 Testing error handling for invalid PR', 'test');
    
    const result = await runner.testErrorHandling(request, {
      owner: 'invalid-owner',
      repo: 'invalid-repo',
      number: 999999,
      timeout: 30000
    });
    
    expect(result.expectedError).toBe(true);
    expect(result.status).toBeGreaterThanOrEqual(400);
  });
});
