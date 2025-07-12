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
    const runner = new PullRequestDetailWebRunner(logger, isProduction ? 443 : webPort);
    
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
}); 