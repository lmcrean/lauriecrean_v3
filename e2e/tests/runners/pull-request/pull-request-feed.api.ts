import { Page, expect } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export interface PullRequestApiTestConfig {
  username: string;
  page: number;
  perPage: number;
  timeout: number;
}

export class PullRequestApiRunner {
  private logger: E2ELogger;
  private apiPort: number;

  constructor(logger: E2ELogger, apiPort: number) {
    this.logger = logger;
    this.apiPort = apiPort;
  }

  async runDirectApiTest(page: Page, config: PullRequestApiTestConfig): Promise<void> {
    this.logger.logInfo('🎯 Testing pull requests endpoint directly...', 'api-runner');
    
    // Navigate directly to the API endpoint
    const apiUrl = `http://localhost:${this.apiPort}/api/github/pull-requests?username=${config.username}&page=${config.page}&per_page=${config.perPage}`;
    
    await page.goto(apiUrl, {
      timeout: config.timeout
    });
    
    const content = await page.textContent('body');
    this.logger.logInfo('📋 Pull Requests API Response (first 200 chars):', 'api-runner', { 
      content: content?.substring(0, 200) 
    });
    
    // Should get JSON response with data structure
    expect(content).toContain('data');
    expect(content).toContain('meta');
  }

  async testApiEndpointWithoutUI(config: PullRequestApiTestConfig): Promise<{ success: boolean; data?: any; error?: string }> {
    this.logger.logInfo('🔗 Testing API endpoint without UI...', 'api-runner');
    
    try {
      const apiUrl = `http://localhost:${this.apiPort}/api/github/pull-requests?username=${config.username}&page=${config.page}&per_page=${config.perPage}`;
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        this.logger.logInfo('✅ Direct API call successful', 'api-runner', { status: response.status });
        return { success: true, data };
      } else {
        this.logger.logError('❌ Direct API call failed', 'api-runner', { status: response.status });
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error: any) {
      this.logger.logError('❌ Direct API call error', 'api-runner', { error: error.message });
      return { success: false, error: error.message };
    }
  }
} 