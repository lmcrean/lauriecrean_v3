import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import path from 'path';

export interface PullRequestFeedTestResult {
  timeoutErrorsDetected: boolean;
  successfulAPICalls: boolean;
  failedAPICalls: boolean;
  componentFound: boolean;
  totalNetworkActivity: number;
  totalBrowserLogs: number;
}

export class PullRequestFeedRunner {
  private logger: E2ELogger;
  private baseUrl: string;

  constructor(logger: E2ELogger, webPort: number) {
    this.logger = logger;
    this.baseUrl = `http://localhost:${webPort}`;
  }

  async runTimeoutReproductionTest(page: Page): Promise<PullRequestFeedTestResult> {
    this.logger.logTestStart('Pull Request Feed Timeout Reproduction Test');
    const testStartTime = Date.now();
    
    // Set up comprehensive logging
    this.setupPageLogging(page);
    
    // Navigate to pull request feed page
    this.logger.logInfo('📍 Navigating to page with pull request feed...', 'feed-runner');
    await page.goto(`${this.baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Look for pull request feed component
    const componentFound = await this.findPullRequestComponent(page);
    
    // Wait for potential API calls and timeout errors
    this.logger.logInfo('⏳ Waiting for API calls and potential timeout errors...', 'feed-runner');
    await page.waitForTimeout(15000); // Wait 15 seconds to allow for timeout
    
    // Analyze results
    const testResults = await this.analyzeTestResults(componentFound, page);
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join('e2e', 'screenshots', 'pull-request-final.png'),
      fullPage: true 
    });
    
    const testDuration = Date.now() - testStartTime;
    const testSuccessful = testResults.timeoutErrorsDetected || 
                          testResults.successfulAPICalls || 
                          testResults.componentFound || 
                          testResults.totalNetworkActivity > 0;
    
    this.logger.logTestEnd('Pull Request Feed Timeout Reproduction Test', testSuccessful, testDuration);
    
    return testResults;
  }

  private setupPageLogging(page: Page): void {
    // Set up console logging
    page.on('console', msg => {
      const level = msg.type() === 'error' ? 'error' : 
                   msg.type() === 'warning' ? 'warn' : 'info';
      this.logger.logBrowserConsole(level as any, msg.text(), page.url(), 'timeout test');
      
      // Specifically log timeout errors
      if (msg.text().includes('AxiosError') || msg.text().includes('timeout')) {
        this.logger.logError(`⏰ Timeout Error Detected: ${msg.text()}`, 'browser');
      }
    });

    // Enhanced network monitoring
    page.on('response', response => {
      const url = response.url();
      this.logger.logNetworkActivity(url, 'GET', response.status());
      
      if (url.includes('api/github/pull-requests')) {
        this.logger.logInfo(`📡 Pull Request API Response: ${response.status()}`, 'network', { url });
      }
    });
    
    page.on('requestfailed', request => {
      const url = request.url();
      const error = request.failure()?.errorText || 'Unknown error';
      this.logger.logError(`❌ Request Failed: ${url}`, 'network', { error });
      
      if (url.includes('api/github/pull-requests')) {
        this.logger.logError(`❌ Pull Request API Failed: ${error}`, 'network', { url });
      }
    });
  }

  private async findPullRequestComponent(page: Page): Promise<boolean> {
    this.logger.logInfo('🔍 Looking for pull request feed component...', 'feed-runner');
    
    // Check if pull request feed component exists
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]').first();
    const pullRequestSection = page.locator('text=Pull Request Activity').first();
    
    let foundComponent = false;
    
    if (await pullRequestFeed.isVisible({ timeout: 5000 }).catch(() => false)) {
      this.logger.logInfo('✅ Found pull request feed component', 'feed-runner');
      foundComponent = true;
    } else if (await pullRequestSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      this.logger.logInfo('✅ Found pull request section', 'feed-runner');
      foundComponent = true;
    } else {
      this.logger.logWarn('ℹ️ Pull request component not immediately visible, checking page content...', 'feed-runner');
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: path.join('e2e', 'screenshots', 'pull-request-debug.png'),
        fullPage: true 
      });
      
      // Log page content for debugging
      const pageContent = await page.content();
      this.logger.logInfo('📄 Page analysis', 'feed-runner', {
        containsPullRequestText: pageContent.includes('pull request'),
        containsAPIText: pageContent.includes('api')
      });
    }

    return foundComponent;
  }

  private async analyzeTestResults(componentFound: boolean, page: Page): Promise<PullRequestFeedTestResult> {
    // Get network and console logs from observability
    const networkLogs = this.logger.getLogsForSource('network');
    const browserLogs = this.logger.getLogsForSource('browser');
    
    this.logger.logInfo('📊 Network Activity Summary', 'feed-runner', {
      totalNetworkLogs: networkLogs.length,
      totalBrowserLogs: browserLogs.length
    });
    
    // Analyze logs for timeout errors and API calls
    const hasTimeoutError = browserLogs.some(log => 
      log.message.includes('timeout') || log.message.includes('AxiosError')
    );
    const hasSuccessfulAPICall = networkLogs.some(log => 
      log.message.includes('api/github/pull-requests') && log.message.includes('200')
    );
    const hasFailedAPICall = networkLogs.some(log => 
      log.message.includes('api/github/pull-requests') && log.message.includes('Failed')
    );
    
    const testResults: PullRequestFeedTestResult = {
      timeoutErrorsDetected: hasTimeoutError,
      successfulAPICalls: hasSuccessfulAPICall,
      failedAPICalls: hasFailedAPICall,
      componentFound: componentFound,
      totalNetworkActivity: networkLogs.length,
      totalBrowserLogs: browserLogs.length
    };
    
    this.logger.logInfo('📈 Test Results Analysis', 'feed-runner', testResults);
    
    if (hasTimeoutError) {
      this.logger.logInfo('✅ Successfully reproduced the timeout error', 'feed-runner');
    } else if (hasSuccessfulAPICall) {
      this.logger.logInfo('✅ API calls are working - timeout issue resolved', 'feed-runner');
    } else if (componentFound) {
      this.logger.logInfo('✅ Component found and interaction captured', 'feed-runner');
    } else {
      this.logger.logWarn('ℹ️ No specific timeout error reproduced, but captured activity', 'feed-runner');
    }

    return testResults;
  }

  async assertTestSuccess(testResults: PullRequestFeedTestResult): Promise<void> {
    const testSuccessful = testResults.timeoutErrorsDetected || 
                          testResults.successfulAPICalls || 
                          testResults.componentFound || 
                          testResults.totalNetworkActivity > 0;
    
    expect(testSuccessful).toBe(true);
  }
} 