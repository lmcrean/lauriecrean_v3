import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export class LandingRunner {
  private logger: E2ELogger;
  private baseUrl: string;

  constructor(logger: E2ELogger, webPort: number) {
    this.logger = logger;
    this.baseUrl = `http://localhost:${webPort}`;
  }

  async runLandingPageTest(page: Page): Promise<void> {
    this.logger.logInfo('🏠 Testing landing page...', 'landing-runner');
    
    // Navigate to landing page
    await page.goto(this.baseUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Basic assertions for landing page
    const pageTitle = await page.title();
    this.logger.logInfo('📄 Landing page loaded', 'landing-runner', { title: pageTitle });
    
    expect(pageTitle).toBeTruthy();
  }

  async checkLandingPageHealth(page: Page): Promise<boolean> {
    try {
      await page.goto(this.baseUrl, { timeout: 10000 });
      this.logger.logInfo('✅ Landing page accessible', 'landing-runner');
      return true;
    } catch (error: any) {
      this.logger.logError('❌ Landing page not accessible', 'landing-runner', { error: error.message });
      return false;
    }
  }
} 