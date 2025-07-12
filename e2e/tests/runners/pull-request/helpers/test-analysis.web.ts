import { Page } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export interface PullRequestDetailTestResult {
  modalOpened: boolean;
  detailDataLoaded: boolean;
  successfulAPICall: boolean;
  failedAPICall: boolean;
  componentInteraction: boolean;
  totalNetworkActivity: number;
  totalBrowserLogs: number;
}

export class TestAnalysisHelper {
  private logger: E2ELogger;

  constructor(logger: E2ELogger) {
    this.logger = logger;
  }

  async analyzeTestResults(
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

  async calculateTestDuration(startTime: number): Promise<number> {
    const duration = Date.now() - startTime;
    this.logger.logInfo(`⏱️ Test duration: ${duration}ms`, 'test');
    return duration;
  }
} 