import { test, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import { PullRequestDetailWebRunner } from '../../runners/pull-request/pull-request-detail.web';

const logger = new E2ELogger();

test.describe('Pull Request Detail Web Tests', () => {
  
  test('should click on PR and open detail modal', async ({ page }) => {
    logger.logInfo('🚀 Starting PR detail web test', 'test');
    
    // Determine if this is a production test based on environment
    const isProduction = process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL;
    
    let baseUrl: string;
    let apiUrl: string;
    let webPort = 3020; // Default E2E web port
    
    if (isProduction) {
      // Production deployment
      baseUrl = process.env.WEB_DEPLOYMENT_URL || 
                process.env.FIREBASE_HOSTING_URL || 
                'https://lauriecrean-free-38256.web.app';
      apiUrl = process.env.API_DEPLOYMENT_URL || 
               process.env.CLOUD_RUN_URL || 
               'https://api-github-main-329000596728.us-central1.run.app';
               
      logger.logInfo(`🌐 Production test - Web: ${baseUrl}, API: ${apiUrl}`, 'test');
    } else {
      // Local E2E test
      baseUrl = `http://localhost:${webPort}`;
      apiUrl = 'http://localhost:3015'; // E2E API port
      
      logger.logInfo(`🏠 Local E2E test - Web: ${baseUrl}, API: ${apiUrl}`, 'test');
    }
    
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
    
    const baseUrl = process.env.WEB_DEPLOYMENT_URL || 
                    process.env.FIREBASE_HOSTING_URL || 
                    'https://lauriecrean-free-38256.web.app';
    const apiUrl = process.env.API_DEPLOYMENT_URL || 
                   process.env.CLOUD_RUN_URL || 
                   'https://api-github-main-329000596728.us-central1.run.app';
    
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