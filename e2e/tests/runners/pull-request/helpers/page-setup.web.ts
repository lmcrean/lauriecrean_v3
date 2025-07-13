import { Page } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export class PageSetupHelper {
  private logger: E2ELogger;

  constructor(logger: E2ELogger) {
    this.logger = logger;
  }

  setupPageLogging(page: Page): void {
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

  async navigateToPullRequestFeed(page: Page, baseUrl: string, timeout: number): Promise<void> {
    this.logger.logInfo('📍 Navigating to pull request feed...', 'test');
    await page.goto(`${baseUrl}/pull-request-feed`, { 
      waitUntil: 'networkidle',
      timeout
    });
    await page.waitForLoadState('domcontentloaded');
  }
} 