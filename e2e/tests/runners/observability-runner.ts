import { E2ELogger } from '@lauriecrean/observability';
import { APIRequestContext } from '@playwright/test';
import { setupApiConnection, getApiBaseUrl } from './operations.api';

export interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  networkCalls: number;
  apiErrors: number;
  startTime: number;
}

export class ObservabilityRunner {
  private logger: E2ELogger;
  private metrics: TestMetrics;
  private suiteName: string;

  constructor(suiteName: string) {
    this.suiteName = suiteName;
    this.logger = new E2ELogger();
    this.metrics = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      networkCalls: 0,
      apiErrors: 0,
      startTime: Date.now()
    };
  }

  // Setup method for test.beforeAll
  async setup(request: APIRequestContext): Promise<void> {
    this.logger.logInfo(`🚀 Starting ${this.suiteName} Test Suite`, 'test');
    
    await setupApiConnection(request);
    this.metrics.startTime = Date.now();
    
    this.logger.logInfo(`🔧 Using API server at: ${getApiBaseUrl()}`, 'test');
  }

  // Teardown method for test.afterAll
  async teardown(): Promise<void> {
    const duration = Date.now() - this.metrics.startTime;
    
    this.logger.logInfo(`📊 ${this.suiteName.toUpperCase()} TEST SUMMARY REPORT`, 'test');
    this.logger.logInfo(`✅ Tests Passed: ${this.metrics.passedTests}`, 'test');
    this.logger.logInfo(`❌ Tests Failed: ${this.metrics.failedTests}`, 'test');
    this.logger.logInfo(`📡 Network Calls: ${this.metrics.networkCalls}`, 'network');
    this.logger.logInfo(`🚨 API Errors: ${this.metrics.apiErrors}`, 'network');
    this.logger.logInfo(`⏱️ Total Duration: ${duration}ms`, 'test');
    this.logger.logInfo(`🎯 Success Rate: ${Math.round((this.metrics.passedTests / this.metrics.totalTests) * 100)}%`, 'test');
    
    console.log(`\n=== ${this.suiteName.toUpperCase()} TEST SUMMARY ===`);
    console.log(`✅ Tests Passed: ${this.metrics.passedTests}`);
    console.log(`❌ Tests Failed: ${this.metrics.failedTests}`);
    console.log(`📡 Network Calls: ${this.metrics.networkCalls}`);
    console.log(`🚨 API Errors: ${this.metrics.apiErrors}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`🎯 Success Rate: ${Math.round((this.metrics.passedTests / this.metrics.totalTests) * 100)}%`);
    console.log('='.repeat(this.suiteName.length + 18) + '\n');
  }

  // Method for test.beforeEach
  incrementTestCount(): void {
    this.metrics.totalTests++;
  }

  // Method for test.afterEach
  recordTestResult(testTitle: string, passed: boolean, error?: any): void {
    if (passed) {
      this.metrics.passedTests++;
      this.logger.logInfo(`✅ ${testTitle}`, 'test');
    } else {
      this.metrics.failedTests++;
      this.logger.logError(`❌ ${testTitle}`, 'test', { error });
    }
  }

  // Method for tracking network calls
  recordNetworkCall(successful: boolean = true): void {
    this.metrics.networkCalls++;
    if (!successful) {
      this.metrics.apiErrors++;
    }
  }

  // Getter for the logger
  getLogger(): E2ELogger {
    return this.logger;
  }

  // Getter for metrics
  getMetrics(): TestMetrics {
    return { ...this.metrics };
  }

  // Helper methods for common logging patterns
  logTestStart(message: string): void {
    this.logger.logInfo(message, 'test');
  }

  logNetworkActivity(message: string): void {
    this.logger.logInfo(message, 'network');
  }

  logTestInfo(message: string): void {
    this.logger.logInfo(message, 'test');
  }

  logNetworkError(message: string, metadata?: any): void {
    this.logger.logError(message, 'network', metadata);
  }
} 