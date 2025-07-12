import { test, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import { PullRequestDetailWebRunner } from '../../runners/pull-request/pull-request-detail.web';
import { getApiUrl, getWebUrl, isProductionTest, DEFAULT_WEB_PORT } from '../../runners/utilities/utilities.api';

const logger = new E2ELogger();

test.describe('Pull Request Detail Web Tests', () => {
  
  test('should click on PR and open detail modal', async ({ page }) => {
    logger.logInfo('🚀 Starting PR detail web test', 'test');
    
    // Get URLs from centralized configuration
    const isProduction = isProductionTest();
    const baseUrl = getWebUrl();
    const apiUrl = getApiUrl();
    const webPort = isProduction ? 443 : DEFAULT_WEB_PORT;
    
    logger.logInfo(`${isProduction ? '🌐 Production' : '🏠 Local'} test - Web: ${baseUrl}, API: ${apiUrl}`, 'test');
    
    // Inject API URL into browser window for frontend to use
    await page.addInitScript((testApiUrl) => {
      (window as any).__TEST_API_URL__ = testApiUrl;
      console.log(`🧪 Injected test API URL: ${testApiUrl}`);
    }, apiUrl);
    
    // Create runner with appropriate base URL
    const runner = new PullRequestDetailWebRunner(logger, baseUrl, isProduction ? 443 : webPort);
    
    // Run the test
    const testResults = await runner.runPullRequestDetailTest(page, {
      prNumber: 33, // Test with specific PR
      owner: 'lmcrean',
      repo: 'developer-portfolio', 
      timeout: 60000
    });
    
    // Assert results
    await runner.assertTestSuccess(testResults);
    
    logger.logInfo(`✅ Test completed successfully`, 'test');
    logger.logInfo(`📊 Results: Modal opened: ${testResults.modalOpened}, Data loaded: ${testResults.detailDataLoaded}`, 'test');
  });

  test('should handle production environment gracefully', async ({ page }) => {
    logger.logInfo('🌐 Testing production environment handling', 'test');
    
    // Get URLs from centralized configuration
    const baseUrl = getWebUrl();
    const apiUrl = getApiUrl();
    
    logger.logInfo(`🌐 Using baseURL: ${baseUrl}`, 'test');
    logger.logInfo(`🔗 Using API URL: ${apiUrl}`, 'test');
    
    // Inject API URL
    await page.addInitScript((testApiUrl) => {
      (window as any).__TEST_API_URL__ = testApiUrl;
      console.log(`🧪 Injected test API URL: ${testApiUrl}`);
    }, apiUrl);
    
    // Navigate to pull request feed
    await page.goto(`${baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that the page loaded successfully
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for pull request feed
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]');
    await expect(pullRequestFeed).toBeVisible({ timeout: 15000 });
    
    logger.logInfo('✅ Production environment is accessible and functional', 'test');
  });

  test('should handle natural API discovery without infinite loops', async ({ page }) => {
    logger.logInfo('🔍 Testing natural API discovery flow (no URL injection)', 'test');
    
    // Get URLs from centralized configuration
    const baseUrl = getWebUrl();
    const apiUrl = getApiUrl();
    
    logger.logInfo(`🌐 Using baseURL: ${baseUrl}`, 'test');
    logger.logInfo(`🔗 Expected API URL: ${apiUrl}`, 'test');
    
    // DO NOT inject test API URL - let it use natural discovery
    // This tests the actual code path users experience
    
    let requestCount = 0;
    const apiRequests: string[] = [];
    const MAX_REQUESTS = 5; // Maximum allowed requests before considering it an infinite loop
    
    // Monitor all API requests to detect infinite loops
    page.on('request', (request) => {
      if (request.url().includes('/api/github/pull-requests')) {
        requestCount++;
        apiRequests.push(request.url());
        logger.logInfo(`📡 API Request #${requestCount}: ${request.url()}`, 'test');
        
        // Fail fast if we detect too many requests (infinite loop)
        if (requestCount > MAX_REQUESTS) {
          throw new Error(`🚨 Infinite loop detected! ${requestCount} API requests made: ${apiRequests.join(', ')}`);
        }
      }
    });
    
    // Navigate to pull request feed
    logger.logInfo('📍 Navigating to pull request feed...', 'test');
    await page.goto(`${baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Give it time to make requests and detect loops
    await page.waitForTimeout(5000);
    
    // Check that we didn't hit the infinite loop
    expect(requestCount).toBeLessThanOrEqual(MAX_REQUESTS);
    logger.logInfo(`✅ Natural API discovery completed successfully with ${requestCount} requests`, 'test');
    
    // Verify the page loaded correctly
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for pull request feed (should be visible if no infinite loop)
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]');
    await expect(pullRequestFeed).toBeVisible({ timeout: 15000 });
    
    logger.logInfo('✅ Natural flow test completed - no infinite loops detected', 'test');
  });
}); 