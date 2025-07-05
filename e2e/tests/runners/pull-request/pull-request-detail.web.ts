import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import path from 'path';

export interface PullRequestDetailTestResult {
  modalOpened: boolean;
  detailDataLoaded: boolean;
  successfulAPICall: boolean;
  failedAPICall: boolean;
  componentInteraction: boolean;
  totalNetworkActivity: number;
  totalBrowserLogs: number;
}

export interface PullRequestDetailConfig {
  prNumber: number;
  owner: string;
  repo: string;
  timeout: number;
}

export class PullRequestDetailWebRunner {
  private logger: E2ELogger;
  private baseUrl: string;

  constructor(logger: E2ELogger, webPort: number) {
    this.logger = logger;
    this.baseUrl = `http://localhost:${webPort}`;
  }

  async runPullRequestDetailTest(page: Page, config: PullRequestDetailConfig): Promise<PullRequestDetailTestResult> {
    this.logger.logInfo('🔍 Starting Pull Request Detail Web Test', 'test');
    const testStartTime = Date.now();
    
    // Set up comprehensive logging
    this.setupPageLogging(page);
    
    // Navigate to pull request feed page first
    this.logger.logInfo('📍 Navigating to pull request feed...', 'test');
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
      path: path.join('screenshots', 'pull-request-detail-final.png'),
      fullPage: true 
    });
    
    const testDuration = Date.now() - testStartTime;
    const testSuccessful = testResults.modalOpened && testResults.detailDataLoaded;
    
    this.logger.logInfo(`✅ Pull Request Detail Web Test completed in ${testDuration}ms`, 'test');
    
    return testResults;
  }

  private setupPageLogging(page: Page): void {
    // Set up console logging
    page.on('console', msg => {
      const level = msg.type() === 'error' ? 'error' : 
                   msg.type() === 'warning' ? 'warn' : 'info';
      this.logger.logInfo(`🖥️ Console [${level}]: ${msg.text()}`, 'browser');
      
      // Log any errors specifically
      if (msg.type() === 'error') {
        this.logger.logError(`❌ Browser Error: ${msg.text()}`, 'browser');
      }
    });

    // Enhanced network monitoring
    page.on('response', response => {
      const url = response.url();
      this.logger.logInfo(`📡 Response: ${response.status()} - ${url}`, 'network');
      
      if (url.includes('api/github/pull-requests')) {
        this.logger.logInfo(`📡 PR API Response: ${response.status()}`, 'network', { url });
      }
    });
    
    page.on('requestfailed', request => {
      const url = request.url();
      const error = request.failure()?.errorText || 'Unknown error';
      this.logger.logError(`❌ Request Failed: ${url}`, 'network', { error });
    });
  }

  private async openPullRequestDetail(page: Page, config: PullRequestDetailConfig): Promise<boolean> {
    this.logger.logInfo(`🔍 Looking for pull request cards in the list...`, 'test');
    
    try {
      // Wait for pull request feed to load
      await page.waitForSelector('[data-testid="pull-request-feed"]', { timeout: 10000 });
      this.logger.logInfo('✅ Pull request feed loaded', 'test');
      
      // Look for pull request cards
      const pullRequestCards = page.locator('[data-testid="pull-request-card"]');
      
      // Wait for cards to appear
      await page.waitForTimeout(2000);
      const cardCount = await pullRequestCards.count();
      
      this.logger.logInfo(`📋 Found ${cardCount} PR cards`, 'test');
      
      if (cardCount > 0) {
        // Try to find the specific PR if prNumber is provided, otherwise use first card
        let targetCard = pullRequestCards.first();
        
        if (config.prNumber) {
          const specificCard = page.locator(`[data-testid="pull-request-card"][data-pr-number="${config.prNumber}"]`);
          if (await specificCard.count() > 0) {
            targetCard = specificCard;
            this.logger.logInfo(`🎯 Found specific PR #${config.prNumber}`, 'test');
          } else {
            this.logger.logInfo(`⚠️ PR #${config.prNumber} not found, using first available card`, 'test');
          }
        }
        
        // Click on the target card
        await targetCard.click();
        this.logger.logInfo('🖱️ Clicked on PR card', 'test');
      } else {
        this.logger.logError('❌ No PR cards found to click', 'test');
        return false;
      }
      
      // Wait for modal to open
      await page.waitForTimeout(2000);
      
      // Check if modal opened
      const modal = page.locator('[data-testid="pull-request-modal"]');
      
      if (await modal.isVisible({ timeout: 5000 }).catch(() => false)) {
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

  private async testDetailDataLoading(page: Page, config: PullRequestDetailConfig): Promise<boolean> {
    this.logger.logInfo('🔍 Testing detail data loading...', 'test');
    
    try {
      // Wait for modal to be fully loaded
      await page.waitForSelector('[data-testid="pull-request-modal"]', { timeout: 10000 });
      
      // Wait for detailed data to load
      await page.waitForTimeout(3000);
      
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
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          fieldsFound++;
          this.logger.logInfo(`✅ Found detail field: ${field}`, 'test');
        } else {
          this.logger.logInfo(`⚠️ Detail field not found: ${field}`, 'test');
        }
      }
      
      // Check for modal content structure
      const modalContent = page.locator('[data-testid="pull-request-detail"]');
      const hasModalContent = await modalContent.isVisible({ timeout: 2000 }).catch(() => false);
      
      // Also check for text content that indicates detailed data
      const pageContent = await page.content();
      const hasDetailedContent = pageContent.includes('commits') || 
                                pageContent.includes('additions') || 
                                pageContent.includes('deletions') ||
                                pageContent.includes('changed files');
      
      if (fieldsFound >= 3 || (hasModalContent && hasDetailedContent)) {
        this.logger.logInfo(`✅ Detail data loaded - ${fieldsFound} fields found, modal content: ${hasModalContent}`, 'test');
        return true;
      } else {
        this.logger.logError(`❌ Insufficient detail data found - ${fieldsFound} fields, modal content: ${hasModalContent}`, 'test');
        return false;
      }
      
    } catch (error: any) {
      this.logger.logError(`❌ Error testing detail data: ${error.message}`, 'test');
      return false;
    }
  }

  private async testComponentInteractions(page: Page): Promise<boolean> {
    this.logger.logInfo('🔍 Testing component interactions...', 'test');
    
    try {
      let interactionsFound = 0;
      
      // Test close button if modal is open
      const closeButton = page.locator('[data-testid="close-modal"]');
      const closeX = page.locator('[data-testid="modal-close-x"]');
      
      if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        this.logger.logInfo('✅ Close button found', 'test');
        interactionsFound++;
      }
      
      if (await closeX.isVisible({ timeout: 2000 }).catch(() => false)) {
        this.logger.logInfo('✅ Close X button found', 'test');
        interactionsFound++;
      }
      
      // Test external links
      const githubLink = page.locator('[data-testid="github-link"]');
      
      if (await githubLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        this.logger.logInfo('✅ GitHub link found', 'test');
        interactionsFound++;
      }
      
      // Test for any GitHub-related links in the modal
      const modalContent = page.locator('[data-testid="pull-request-detail"]');
      const githubLinks = modalContent.locator('button:has-text("GitHub"), a[href*="github.com"]');
      const githubLinkCount = await githubLinks.count();
      
      if (githubLinkCount > 0) {
        this.logger.logInfo(`✅ Found ${githubLinkCount} GitHub-related links`, 'test');
        interactionsFound++;
      }
      
      if (interactionsFound > 0) {
        this.logger.logInfo(`✅ Component interactions working - ${interactionsFound} interactive elements found`, 'test');
        return true;
      } else {
        this.logger.logInfo('ℹ️ No specific interactive elements found, but component rendered', 'test');
        return true; // Still consider it a success if modal is open
      }
      
    } catch (error: any) {
      this.logger.logError(`❌ Error testing interactions: ${error.message}`, 'test');
      return false;
    }
  }

  private async analyzeTestResults(
    modalOpened: boolean, 
    detailDataLoaded: boolean, 
    componentInteraction: boolean, 
    page: Page
  ): Promise<PullRequestDetailTestResult> {
    
    // Get network and console logs from observability
    const networkLogs = this.logger.getLogsForSource('network');
    const browserLogs = this.logger.getLogsForSource('browser');
    
    this.logger.logInfo('📊 Web Test Analysis', 'test', {
      totalNetworkLogs: networkLogs.length,
      totalBrowserLogs: browserLogs.length
    });
    
    // Analyze logs for API calls
    const hasSuccessfulAPICall = networkLogs.some(log => 
      log.message.includes('api/github/pull-requests') && log.message.includes('200')
    );
    const hasFailedAPICall = networkLogs.some(log => 
      log.message.includes('api/github/pull-requests') && log.message.includes('Failed')
    );
    
    const testResults: PullRequestDetailTestResult = {
      modalOpened,
      detailDataLoaded,
      successfulAPICall: hasSuccessfulAPICall,
      failedAPICall: hasFailedAPICall,
      componentInteraction,
      totalNetworkActivity: networkLogs.length,
      totalBrowserLogs: browserLogs.length
    };
    
    this.logger.logInfo('📈 Web Test Results', 'test', testResults);
    
    return testResults;
  }

  async assertTestSuccess(testResults: PullRequestDetailTestResult): Promise<void> {
    expect(testResults.modalOpened).toBe(true);
    expect(testResults.detailDataLoaded).toBe(true);
    expect(testResults.successfulAPICall).toBe(true);
  }
}
