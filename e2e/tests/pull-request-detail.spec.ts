import { test, expect } from '@playwright/test';
import { ObservabilityRunner } from './runners/setup/observability-runner';
import { PullRequestDetailWebRunner, PullRequestDetailConfig } from './runners/pull-request/pull-request-detail.web';
import { E2ELogger } from '@lauriecrean/observability';

const observability = new ObservabilityRunner('Pull Request Detail Web');
const logger = new E2ELogger();

test.describe('Pull Request Detail Web Tests', () => {
  let webRunner: PullRequestDetailWebRunner;
  const webPort = 3020; // Based on the user rules for web development port

  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
    webRunner = new PullRequestDetailWebRunner(logger, webPort);
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

  test('should open and display pull request detail modal', async ({ page }) => {
    observability.logTestStart('🔍 Testing pull request detail modal opening');
    
    const config: PullRequestDetailConfig = {
      prNumber: 1, // Generic PR number for testing
      owner: 'lmcrean',
      repo: 'test-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    observability.recordNetworkCall(testResults.successfulAPICall);
    
    // Assert that the modal opened successfully
    expect(testResults.modalOpened).toBe(true);
    
    observability.logTestInfo(`✅ Modal opened: ${testResults.modalOpened}`);
    observability.logTestInfo(`📊 Network activity: ${testResults.totalNetworkActivity} calls`);
  });

  test('should load and display detailed pull request data', async ({ page }) => {
    observability.logTestStart('🔍 Testing detailed pull request data loading');
    
    const config: PullRequestDetailConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'test-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    observability.recordNetworkCall(testResults.successfulAPICall);
    
    // Assert that detailed data loaded
    expect(testResults.detailDataLoaded).toBe(true);
    
    observability.logTestInfo(`✅ Detail data loaded: ${testResults.detailDataLoaded}`);
    observability.logTestInfo(`🔧 Component interaction: ${testResults.componentInteraction}`);
  });

  test('should handle API calls for pull request details', async ({ page }) => {
    observability.logTestStart('🔍 Testing API call handling for PR details');
    
    const config: PullRequestDetailConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'test-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    observability.recordNetworkCall(testResults.successfulAPICall);
    
    // Assert that API calls were made
    expect(testResults.totalNetworkActivity).toBeGreaterThan(0);
    
    if (testResults.successfulAPICall) {
      observability.logNetworkActivity('✅ Successful API call detected');
    }
    
    if (testResults.failedAPICall) {
      observability.logNetworkActivity('⚠️ Failed API call detected');
    }
    
    observability.logTestInfo(`📡 Total network activity: ${testResults.totalNetworkActivity}`);
  });

  test('should provide interactive elements in detail view', async ({ page }) => {
    observability.logTestStart('🔍 Testing interactive elements in detail view');
    
    const config: PullRequestDetailConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'test-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    observability.recordNetworkCall(testResults.successfulAPICall);
    
    // Assert that component interaction was successful
    expect(testResults.componentInteraction).toBe(true);
    
    observability.logTestInfo(`🔧 Component interaction successful: ${testResults.componentInteraction}`);
  });

  test('should handle error states gracefully', async ({ page }) => {
    observability.logTestStart('🚨 Testing error handling in detail view');
    
    // Test with potentially non-existent PR
    const config: PullRequestDetailConfig = {
      prNumber: 999999,
      owner: 'invalid-user',
      repo: 'invalid-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    
    // In error cases, we should still have basic functionality
    expect(testResults.totalNetworkActivity).toBeGreaterThan(0);
    
    if (testResults.failedAPICall) {
      observability.logNetworkActivity('✅ Error handling working - failed API call detected');
    }
    
    observability.logTestInfo(`📊 Error test results: Network activity: ${testResults.totalNetworkActivity}, Browser logs: ${testResults.totalBrowserLogs}`);
  });

  test('should complete full detail workflow', async ({ page }) => {
    observability.logTestStart('🔄 Testing complete pull request detail workflow');
    
    const config: PullRequestDetailConfig = {
      prNumber: 1,
      owner: 'lmcrean',
      repo: 'test-repo',
      timeout: 30000
    };

    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    observability.recordNetworkCall(testResults.successfulAPICall);
    
    // Use the runner's assertion method for comprehensive checking
    await webRunner.assertTestSuccess(testResults);
    
    observability.logTestInfo('✅ Full detail workflow completed successfully');
    observability.logTestInfo(`📊 Final Results: Modal: ${testResults.modalOpened}, Data: ${testResults.detailDataLoaded}, API: ${testResults.successfulAPICall}`);
  });
});
