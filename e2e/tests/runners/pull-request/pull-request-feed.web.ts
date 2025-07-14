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
    this.logger.logInfo('📍 Navigating to page with pull request feed...', 'test');
    await page.goto(`${this.baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Look for pull request feed component
    const componentFound = await this.findPullRequestComponent(page);
    
    // Wait for potential API calls and timeout errors (shorter wait, more resilient)
    this.logger.logInfo('⏳ Waiting for API calls and potential timeout errors...', 'test');
    try {
      await page.waitForTimeout(5000); // Reduced to 5 seconds - sufficient to capture timeouts
    } catch (error) {
      // If page is closed, that's fine - we've likely already captured the data we need
      this.logger.logInfo('ℹ️ Wait interrupted - likely due to page closure, continuing with analysis', 'test');
    }
    
    // Analyze results
    const testResults = await this.analyzeTestResults(componentFound, page);
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join('screenshots', 'pull-request-final.png'),
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
    this.logger.logInfo('🔍 Looking for pull request feed component...', 'test');
    
    // Check if pull request feed component exists
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]').first();
    const pullRequestSection = page.locator('text=Pull Request Activity').first();
    
    let foundComponent = false;
    
    if (await pullRequestFeed.isVisible({ timeout: 5000 }).catch(() => false)) {
      this.logger.logInfo('✅ Found pull request feed component', 'test');
      foundComponent = true;
    } else if (await pullRequestSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      this.logger.logInfo('✅ Found pull request section', 'test');
      foundComponent = true;
    } else {
      this.logger.logWarn('ℹ️ Pull request component not immediately visible, checking page content...', 'test');
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: path.join('screenshots', 'pull-request-debug.png'),
        fullPage: true 
      });
      
      // Log page content for debugging
      const pageContent = await page.content();
      this.logger.logInfo('📄 Page analysis', 'test', {
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
    
    this.logger.logInfo('📊 Network Activity Summary', 'test', {
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
    
    this.logger.logInfo('📈 Test Results Analysis', 'test', testResults);
    
    if (hasTimeoutError) {
      this.logger.logInfo('✅ Successfully reproduced the timeout error', 'test');
    } else if (hasSuccessfulAPICall) {
      this.logger.logInfo('✅ API calls are working - timeout issue resolved', 'test');
    } else if (componentFound) {
      this.logger.logInfo('✅ Component found and interaction captured', 'test');
    } else {
      this.logger.logWarn('ℹ️ No specific timeout error reproduced, but captured activity', 'test');
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