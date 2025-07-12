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
}); 