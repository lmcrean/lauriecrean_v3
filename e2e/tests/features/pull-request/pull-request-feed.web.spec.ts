import { test, expect } from '@playwright/test';
import { 
  ServiceManager, 
  ServiceManagerConfig,
  PullRequestFeedRunner,
  HealthRunner,
  PullRequestApiRunner,
  PullRequestApiTestConfig
} from '../../runners';
import { DEFAULT_WEB_PORT, DEFAULT_API_PORT, TEST_USERNAME } from '../../runners/utilities/utilities.api';

/**
 * E2E test for Pull Request Feed API integration
 * Refactored to use modular runners for better organization and reusability
 */
test.describe('Pull Request Feed API Integration - Refactored', () => {
  let serviceManager: ServiceManager;
  let pullRequestFeedRunner: PullRequestFeedRunner;
  let healthRunner: HealthRunner;
  let apiRunner: PullRequestApiRunner;
  
  // Configuration
  const config: ServiceManagerConfig = {
    webPort: DEFAULT_WEB_PORT,
    apiPort: DEFAULT_API_PORT,
    startupWaitTime: 15000,
    logFilePath: 'test-results/pull-request-feed-e2e-logs.json'
  };

  const apiTestConfig: PullRequestApiTestConfig = {
    username: TEST_USERNAME,
    page: 1,
    perPage: 5,
    timeout: 15000
  };
  
  // Setup: Start both services before tests
  test.beforeAll(async () => {
    // Initialize service manager
    serviceManager = new ServiceManager(config);
    
    // Initialize runners with logger and ports
    const logger = serviceManager.getLogger();
    pullRequestFeedRunner = new PullRequestFeedRunner(logger, config.webPort);
    healthRunner = new HealthRunner(logger, config.apiPort);
    apiRunner = new PullRequestApiRunner(logger, config.apiPort);
    
    // Start services
    await serviceManager.startServices();
    
    // Perform health checks
    await serviceManager.performHealthChecks();
  });
  
  // Cleanup: Stop services after tests
  test.afterAll(async () => {
    await serviceManager.stopServices();
  });

  test('should reproduce timeout error when fetching pull requests', async ({ page }) => {
    // Run the timeout reproduction test using the pull request feed runner
    const testResults = await pullRequestFeedRunner.runTimeoutReproductionTest(page);
    
    // Assert test success based on results
    await pullRequestFeedRunner.assertTestSuccess(testResults);
  });

  test('should verify API server is running independently', async ({ page }) => {
    // Run health check using the health runner
    await healthRunner.runHealthCheck(page);
  });

  test('should test pull requests endpoint directly', async ({ page }) => {
    // Run direct API test using the API runner
    await apiRunner.runDirectApiTest(page, apiTestConfig);
  });

  test('should test API endpoint without UI', async () => {
    // Test API directly without browser/UI
    const result = await apiRunner.testApiEndpointWithoutUI(apiTestConfig);
    
    expect(result.success).toBe(true);
    if (result.data) {
      expect(result.data).toHaveProperty('data');
      expect(result.data).toHaveProperty('meta');
    }
  });

  test('should handle natural API discovery without infinite loops', async ({ page }) => {
    const logger = serviceManager.getLogger();
    
    logger.logInfo('🔍 Testing natural API discovery flow (no URL injection)', 'test');
    
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
    
    // Navigate to pull request feed using local development server
    const webUrl = `http://localhost:${config.webPort}/pull-request-feed`;
    logger.logInfo(`📍 Navigating to pull request feed: ${webUrl}`, 'test');
    
    await page.goto(webUrl, { 
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