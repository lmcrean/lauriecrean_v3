import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export class HealthRunner {
  private logger: E2ELogger;
  private apiPort: number;

  constructor(logger: E2ELogger, apiPort: number) {
    this.logger = logger;
    this.apiPort = apiPort;
  }

  async runHealthCheck(page: Page): Promise<void> {
    this.logger.logInfo('🔧 Testing API server health directly...', 'test');
    
    // Direct API health check
    await page.goto(`http://localhost:${this.apiPort}/health`);
    
    // Check if we get JSON response
    const content = await page.textContent('body');
    this.logger.logInfo('🏥 API Health Response:', 'network', { content });
    
    expect(content).toContain('ok');
    expect(content).toContain('api-github');
  }
} 