import { test, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import path from 'path';

// Production Web Runner class
class PullRequestDetailProdWebRunner {
  private logger: E2ELogger;
  private baseUrl: string;

  constructor(logger: E2ELogger) {
    this.logger = logger;
    this.baseUrl = 'https://lauriecrean.dev';
  }

  async runPullRequestDetailTest(page: any, config: any): Promise<any> {
    this.logger.logInfo('🔍 Starting Pull Request Detail Production Test', 'test');
    const testStartTime = Date.now();
    
    // Set up comprehensive logging
    this.setupPageLogging(page);
    
    // Navigate to pull request feed page first
    this.logger.logInfo('📍 Navigating to production pull request feed...', 'test');
    await page.goto(`${this.baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout: config.timeout 
    });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Look for pull request items and click on the target PR
    const modalOpened = await this.openPullRequestDetail(page, config);
    
    // Test detail data loading
    const detailDataLoaded = await this.testDetailDataLoading(page, config);
    
    // Test component interactions
    const componentInteraction = await this.testComponentInteractions(page);
    
    // Wait for API calls to complete
    await page.waitForTimeout(3000);
    
    // Analyze results
    const testResults = await this.analyzeTestResults(modalOpened, detailDataLoaded, componentInteraction, page);
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join('screenshots', 'pull-request-detail-prod-final.png'),
      fullPage: true 
    });
    
    const testDuration = Date.now() - testStartTime;
    
    this.logger.logInfo(`✅ Pull Request Detail Production Test completed in ${testDuration}ms`, 'test');
    
    return testResults;
  }

  private setupPageLogging(page: any): void {
    // Set up console logging
    page.on('console', (msg: any) => {
      const level = msg.type() === 'error' ? 'error' : 
                   msg.type() === 'warning' ? 'warn' : 'info';
      this.logger.logInfo(`🖥️ Console [${level}]: ${msg.text()}`, 'browser');
      
      // Log any errors specifically
      if (msg.type() === 'error') {
        this.logger.logError(`❌ Browser Error: ${msg.text()}`, 'browser');
      }
    });

    // Enhanced network monitoring
    page.on('response', (response: any) => {
      const url = response.url();
      this.logger.logInfo(`📡 Response: ${response.status()} - ${url}`, 'network');
      
      if (url.includes('api/github/pull-requests')) {
        this.logger.logInfo(`📡 PR API Response: ${response.status()}`, 'network', { url });
      }
    });
    
    page.on('requestfailed', (request: any) => {
      const url = request.url();
      const error = request.failure()?.errorText || 'Unknown error';
      this.logger.logError(`❌ Request Failed: ${url}`, 'network', { error });
    });
  }

  private async openPullRequestDetail(page: any, config: any): Promise<boolean> {
    this.logger.logInfo(`🔍 Looking for pull request cards in the production site...`, 'test');
    
    try {
      // Wait for pull request feed to load
      await page.waitForSelector('[data-testid="pull-request-feed"]', { timeout: 15000 });
      this.logger.logInfo('✅ Pull request feed loaded', 'test');
      
      // Look for pull request cards
      const pullRequestCards = page.locator('[data-testid="pull-request-card"]');
      
      // Wait for cards to appear
      await page.waitForTimeout(3000);
      const cardCount = await pullRequestCards.count();
      
      this.logger.logInfo(`📋 Found ${cardCount} PR cards`, 'test');
      
      if (cardCount > 0) {
        // Use first available card for production test
        let targetCard = pullRequestCards.first();
        
        this.logger.logInfo(`🎯 Using first available PR card for production test`, 'test');
        
        // Click on the target card
        await targetCard.click();
        this.logger.logInfo('🖱️ Clicked on PR card', 'test');
      } else {
        this.logger.logError('❌ No PR cards found to click', 'test');
        return false;
      }
      
      // Wait for modal to open
      await page.waitForTimeout(3000);
      
      // Check if modal opened
      const modal = page.locator('[data-testid="pull-request-modal"]');
      
      if (await modal.isVisible({ timeout: 10000 }).catch(() => false)) {
        this.logger.logInfo('✅ PR detail modal opened', 'test');
        return true;
      } else {
        this.logger.logError('❌ PR detail modal did not open', 'test');
        return false;
      }
      
    } catch (error: any) {
      this.logger.logError(`❌ Error opening PR detail: ${error.message}`, 'test');
      return false;
    }
  }

  private async testDetailDataLoading(page: any, config: any): Promise<boolean> {
    this.logger.logInfo('🔍 Testing detail data loading...', 'test');
    
    try {
      // Wait for modal to be fully loaded
      await page.waitForSelector('[data-testid="pull-request-modal"]', { timeout: 15000 });
      
      // Wait for detailed data to load
      await page.waitForTimeout(5000);
      
      // Check for detailed fields that should be present
      const detailFields = [
        '[data-testid="pr-commits"]',
        '[data-testid="pr-additions"]',
        '[data-testid="pr-deletions"]',
        '[data-testid="pr-changed-files"]',
        '[data-testid="pr-author"]'
      ];
      
      let fieldsFound = 0;
      
      for (const field of detailFields) {
        const element = page.locator(field);
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          fieldsFound++;
          this.logger.logInfo(`✅ Found detail field: ${field}`, 'test');
        } else {
          this.logger.logInfo(`⚠️ Detail field not found: ${field}`, 'test');
        }
      }
      
      // Check for modal content structure
      const modalContent = page.locator('[data-testid="pull-request-detail"]');
      const hasModalContent = await modalContent.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (hasModalContent || fieldsFound > 0) {
        this.logger.logInfo(`✅ Detail data loaded successfully (${fieldsFound} fields found)`, 'test');
        return true;
      } else {
        this.logger.logError('❌ Detail data did not load properly', 'test');
        return false;
      }
      
    } catch (error: any) {
      this.logger.logError(`❌ Error testing detail data loading: ${error.message}`, 'test');
      return false;
    }
  }

  private async testComponentInteractions(page: any): Promise<boolean> {
    this.logger.logInfo('🔍 Testing component interactions...', 'test');
    
    try {
      // Test modal close button
      const closeButton = page.locator('[data-testid="modal-close-button"]');
      if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        this.logger.logInfo('✅ Modal close button is visible', 'test');
        return true;
      } else {
        this.logger.logInfo('⚠️ Modal close button not found', 'test');
        return false;
      }
      
    } catch (error: any) {
      this.logger.logError(`❌ Error testing component interactions: ${error.message}`, 'test');
      return false;
    }
  }

  private async analyzeTestResults(
    modalOpened: boolean, 
    detailDataLoaded: boolean, 
    componentInteraction: boolean, 
    page: any
  ): Promise<any> {
    this.logger.logInfo('📊 Analyzing test results...', 'test');
    
    // Get page performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        responseTime: navigation.responseEnd - navigation.requestStart
      };
    });
    
    this.logger.logInfo(`📈 Performance - Load Time: ${performanceMetrics.loadTime}ms`, 'test');
    this.logger.logInfo(`📈 Performance - DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`, 'test');
    this.logger.logInfo(`📈 Performance - Response Time: ${performanceMetrics.responseTime}ms`, 'test');
    
    return {
      modalOpened,
      detailDataLoaded,
      componentInteraction,
      performanceMetrics,
      successfulAPICall: true, // Production assumes API is working
      failedAPICall: false,
      totalNetworkActivity: 1,
      totalBrowserLogs: 1
    };
  }
}

// Test configuration interface
interface PullRequestDetailConfig {
  prNumber?: number;
  owner: string;
  repo: string;
  timeout: number;
}

const logger = new E2ELogger();

test.describe('Production Pull Request Detail Tests', () => {
  let webRunner: PullRequestDetailProdWebRunner;

  test.beforeAll(async () => {
    webRunner = new PullRequestDetailProdWebRunner(logger);
  });

  test('should click on PR and open detail modal in production', async ({ page }) => {
    logger.logInfo('🚀 Starting production PR detail test', 'test');
    
    const config: PullRequestDetailConfig = {
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 60000 // Longer timeout for production
    };

    // Run the production test
    const testResults = await webRunner.runPullRequestDetailTest(page, config);
    
    // Assert the test results
    expect(testResults.modalOpened).toBe(true);
    expect(testResults.detailDataLoaded).toBe(true);
    
    logger.logInfo(`✅ Production test completed successfully`, 'test');
    logger.logInfo(`📊 Modal opened: ${testResults.modalOpened}`, 'test');
    logger.logInfo(`📊 Detail data loaded: ${testResults.detailDataLoaded}`, 'test');
    logger.logInfo(`📊 Component interaction: ${testResults.componentInteraction}`, 'test');
  });

  test('should handle production environment gracefully', async ({ page }) => {
    logger.logInfo('🌐 Testing production environment handling', 'test');
    
    const config: PullRequestDetailConfig = {
      owner: 'lmcrean',
      repo: 'lauriecrean',
      timeout: 60000
    };

    // Navigate to production site
    await page.goto('https://lauriecrean.dev/pull-request-feed', { 
      waitUntil: 'networkidle',
      timeout: config.timeout 
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