import { test, expect } from '@playwright/test';
import { 
  ObservabilityRunner,
  PullRequestDetailWebRunner, 
  PullRequestDetailTestResult as WebTestResult,
  PullRequestDetailApiRunner
} from '../../runners';

// Import separate config interfaces from their respective runners
import { PullRequestDetailConfig as WebConfig } from '../../runners/pull-request/pull-request-detail.web';
import { PullRequestDetailConfig as ApiConfig } from '../../runners/pull-request/pull-request-detail.api';
import { E2ELogger } from '@lauriecrean/observability';

const observability = new ObservabilityRunner('Pull Request Detail Web & API');
const logger = new E2ELogger();

test.describe('Pull Request Detail Web & API Tests', () => {
  let webRunner: PullRequestDetailWebRunner;
  let apiRunner: PullRequestDetailApiRunner;
  const webPort = 3020; // E2E testing mode uses port 3020 per PORTS.md

  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
    webRunner = new PullRequestDetailWebRunner(logger, webPort);
    apiRunner = new PullRequestDetailApiRunner(logger);
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

  test('should run web and API tests concurrently', async ({ page, request }) => {
    observability.logTestStart('🔄 Testing concurrent web and API pull request detail functionality');
    
    const webConfig: WebConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    const apiConfig: ApiConfig = {
      number: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    // Run both web and API tests concurrently
    const [webResults, apiResults] = await Promise.all([
      webRunner.runPullRequestDetailTest(page, webConfig),
      apiRunner.fetchPullRequestDetails(request, apiConfig)
    ]);

    // Record network calls for both
    observability.recordNetworkCall(webResults.successfulAPICall);
    observability.recordNetworkCall(apiResults.success);
    
    // Assert both tests were successful
    expect(webResults.modalOpened).toBe(true);
    expect(webResults.detailDataLoaded).toBe(true);
    expect(apiResults.success).toBe(true);
    
    // Validate API data structure if successful
    if (apiResults.success && apiResults.data) {
      const isValidStructure = await apiRunner.validatePullRequestDetailStructure(apiResults.data);
      expect(isValidStructure).toBe(true);
    }
    
    observability.logTestInfo(`✅ Web modal opened: ${webResults.modalOpened}`);
    observability.logTestInfo(`✅ Web data loaded: ${webResults.detailDataLoaded}`);
    observability.logTestInfo(`✅ API call successful: ${apiResults.success}`);
    observability.logTestInfo(`📊 Total network activity: ${webResults.totalNetworkActivity}`);
  });

  test('should handle concurrent API calls and web interactions', async ({ page, request }) => {
    observability.logTestStart('🔄 Testing concurrent API calls with web interactions');
    
    const webConfig: WebConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    const apiConfig: ApiConfig = {
      number: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    // Start web test
    const webTestPromise = webRunner.runPullRequestDetailTest(page, webConfig);

    // Start multiple API calls concurrently
    const apiCallPromises = [
      apiRunner.fetchPullRequestDetails(request, apiConfig),
      apiRunner.fetchPullRequestDetails(request, apiConfig)
    ];

    // Wait for all to complete
    const [webResults, ...apiResults] = await Promise.all([
      webTestPromise,
      ...apiCallPromises
    ]);

    // Record all network calls
    observability.recordNetworkCall(webResults.successfulAPICall);
    apiResults.forEach(result => observability.recordNetworkCall(result.success));
    
    // Assert web functionality
    expect(webResults.componentInteraction).toBe(true);
    expect(webResults.totalNetworkActivity).toBeGreaterThan(0);
    
    // Assert all API calls were successful
    apiResults.forEach((result, index) => {
      expect(result.success).toBe(true);
      observability.logTestInfo(`✅ API call ${index + 1} successful: ${result.success}`);
    });
    
    observability.logTestInfo(`📊 Web network activity: ${webResults.totalNetworkActivity}`);
    observability.logTestInfo(`🔄 Concurrent API calls completed: ${apiResults.length}`);
  });

  test('should validate API data structure during web interaction', async ({ page, request }) => {
    observability.logTestStart('🔍 Testing API data structure validation during web interaction');
    
    const webConfig: WebConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    const apiConfig: ApiConfig = {
      number: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    // Run web test and API validation concurrently
    const [webResults, apiResults] = await Promise.all([
      webRunner.runPullRequestDetailTest(page, webConfig),
      apiRunner.fetchPullRequestDetails(request, apiConfig)
    ]);

    observability.recordNetworkCall(webResults.successfulAPICall);
    observability.recordNetworkCall(apiResults.success);
    
    // Assert web functionality
    expect(webResults.detailDataLoaded).toBe(true);
    
    // Validate API data structure
    if (apiResults.success && apiResults.data) {
      const isValidStructure = await apiRunner.validatePullRequestDetailStructure(apiResults.data);
      expect(isValidStructure).toBe(true);
      
      observability.logTestInfo(`✅ API data structure validation: ${isValidStructure}`);
      observability.logTestInfo(`📊 PR Details: ${apiResults.data.title} (${apiResults.data.commits} commits)`);
    }
    
    observability.logTestInfo(`✅ Web detail data loaded: ${webResults.detailDataLoaded}`);
  });

  test('should handle concurrent error scenarios', async ({ page, request }) => {
    observability.logTestStart('🚨 Testing concurrent error handling');
    
    // Test with potentially invalid data
    const invalidWebConfig: WebConfig = {
      prNumber: 999999,
      owner: 'invalid-user',
      repo: 'invalid-repo',
      timeout: 30000
    };

    const invalidApiConfig: ApiConfig = {
      number: 999999,
      owner: 'invalid-user',
      repo: 'invalid-repo',
      timeout: 30000
    };

    // Run both error scenarios concurrently
    const [webResults, apiErrorResults] = await Promise.all([
      webRunner.runPullRequestDetailTest(page, invalidWebConfig),
      apiRunner.testErrorHandling(request, invalidApiConfig)
    ]);

    // Record network activity
    observability.recordNetworkCall(webResults.successfulAPICall);
    observability.recordNetworkCall(apiErrorResults.success);
    
    // Assert error handling is working
    expect(webResults.totalNetworkActivity).toBeGreaterThan(0);
    expect(apiErrorResults.expectedError).toBe(true);
    
    observability.logTestInfo(`✅ Web error handling: Network activity ${webResults.totalNetworkActivity}`);
    observability.logTestInfo(`✅ API error handling: Expected error ${apiErrorResults.expectedError}`);
  });

  test('should complete full concurrent workflow', async ({ page, request }) => {
    observability.logTestStart('🔄 Testing complete concurrent pull request detail workflow');
    
    const webConfig: WebConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    const apiConfig: ApiConfig = {
      number: 1,
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 30000
    };

    // Run comprehensive concurrent test
    const [webResults, apiResults] = await Promise.all([
      webRunner.runPullRequestDetailTest(page, webConfig),
      apiRunner.fetchPullRequestDetails(request, apiConfig)
    ]);

    observability.recordNetworkCall(webResults.successfulAPICall);
    observability.recordNetworkCall(apiResults.success);
    
    // Use the web runner's assertion method for comprehensive checking
    await webRunner.assertTestSuccess(webResults);
    
    // Assert API success
    expect(apiResults.success).toBe(true);
    
    observability.logTestInfo('✅ Full concurrent workflow completed successfully');
    observability.logTestInfo(`📊 Web Results: Modal: ${webResults.modalOpened}, Data: ${webResults.detailDataLoaded}, API: ${webResults.successfulAPICall}`);
    observability.logTestInfo(`📊 API Results: Success: ${apiResults.success}, Status: ${apiResults.status}`);
  });
});
