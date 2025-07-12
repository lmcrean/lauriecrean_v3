import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import path from 'path';
import { PageSetupHelper } from './helpers/page-setup';
import { ModalInteractionHelper } from './helpers/modal-interaction';
import { TestAnalysisHelper, PullRequestDetailTestResult } from './helpers/test-analysis';

export interface PullRequestDetailConfig {
  prNumber: number;
  owner: string;
  repo: string;
  timeout: number;
}

export class PullRequestDetailWebRunner {
  private logger: E2ELogger;
  private baseUrl: string;
  private pageSetup: PageSetupHelper;
  private modalInteraction: ModalInteractionHelper;
  private testAnalysis: TestAnalysisHelper;

  constructor(logger: E2ELogger, webPort: number) {
    this.logger = logger;
    // Handle production vs local URLs
    if (webPort === 443 || process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL) {
      this.baseUrl = ''; // Will be set dynamically
    } else {
      this.baseUrl = `http://localhost:${webPort}`;
    }
    this.pageSetup = new PageSetupHelper(logger);
    this.modalInteraction = new ModalInteractionHelper(logger);
    this.testAnalysis = new TestAnalysisHelper(logger);
  }

  async runPullRequestDetailTest(page: Page, config: PullRequestDetailConfig): Promise<PullRequestDetailTestResult> {
    this.logger.logInfo('🔍 Starting Pull Request Detail Web Test', 'test');
    const testStartTime = Date.now();
    
    // Set up page logging
    this.pageSetup.setupPageLogging(page);
    
    // Navigate to pull request feed
    const baseUrl = this.baseUrl || page.url().split('/')[0] + '//' + page.url().split('/')[2];
    await this.pageSetup.navigateToPullRequestFeed(page, baseUrl, config.timeout);
    
    // Open PR detail modal
    const modalOpened = await this.modalInteraction.openPullRequestDetail(page, config.prNumber);
    
    // Test detail data loading
    const detailDataLoaded = await this.modalInteraction.testDetailDataLoading(page);
    
    // Test component interactions
    const componentInteraction = await this.modalInteraction.testComponentInteractions(page);
    
    // Wait for API calls to complete
    await page.waitForTimeout(3000);
    
    // Analyze results
    const testResults = await this.testAnalysis.analyzeTestResults(
      modalOpened, 
      detailDataLoaded, 
      componentInteraction, 
      page
    );
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join('screenshots', 'pull-request-detail-final.png'),
      fullPage: true 
    });
    
    const testDuration = await this.testAnalysis.calculateTestDuration(testStartTime);
    
    this.logger.logInfo(`✅ Pull Request Detail Web Test completed in ${testDuration}ms`, 'test');
    
    return testResults;
  }

  async assertTestSuccess(testResults: PullRequestDetailTestResult): Promise<void> {
    expect(testResults.modalOpened).toBe(true);
    expect(testResults.detailDataLoaded).toBe(true);
    expect(testResults.successfulAPICall).toBe(true);
  }
}

// Re-export types from helpers
export type { PullRequestDetailTestResult } from './helpers/test-analysis';
