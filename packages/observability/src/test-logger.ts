import { BrowserLogger } from './browser-logger';
import { E2ELogger } from './e2e-logger';
import { LogLevel, LoggerConfig } from './types';

export interface TestLoggerOptions {
  testName?: string;
  enableBrowserLogs?: boolean;
  enableNetworkLogs?: boolean;
  logToFile?: boolean;
  logToConsole?: boolean;
  filterPatterns?: string[];
  logLevels?: LogLevel[];
}

export function createTestLogger(options: TestLoggerOptions = {}) {
  const config: Partial<LoggerConfig> = {
    enableBrowserLogs: options.enableBrowserLogs ?? true,
    enableNetworkLogs: options.enableNetworkLogs ?? true,
    logToFile: options.logToFile ?? true,
    logToConsole: options.logToConsole ?? true,
    filterPatterns: options.filterPatterns ?? [],
    logLevels: options.logLevels ?? [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.LOG],
    logFilePath: `test-results/${options.testName || 'default'}-browser-logs.json`
  };

  const browserLogger = new BrowserLogger(config);
  const e2eLogger = new E2ELogger({
    ...config,
    logFilePath: `test-results/${options.testName || 'default'}-e2e-logs.json`
  });

  if (options.testName) {
    browserLogger.setCurrentTest(options.testName);
  }

  return {
    browserLogger,
    e2eLogger,
    
    // Convenience methods
    logInfo: (message: string, metadata?: Record<string, any>) => {
      e2eLogger.logInfo(message, 'test', metadata);
    },
    
    logError: (message: string, metadata?: Record<string, any>) => {
      e2eLogger.logError(message, 'test', metadata);
    },
    
    logWarn: (message: string, metadata?: Record<string, any>) => {
      e2eLogger.logWarn(message, 'test', metadata);
    },

    attachToPage: (page: any) => {
      browserLogger.attachToPage(page);
    },

    finalize: () => {
      e2eLogger.finalize();
      return {
        browserReport: browserLogger.generateReport(),
        browserLogs: browserLogger.getLogs(),
        e2eLogs: e2eLogger.getLogs()
      };
    }
  };
}

// Preset configurations for common test scenarios
export const createPullRequestTestLogger = () => createTestLogger({
  testName: 'pull-request-feed',
  enableBrowserLogs: true,
  enableNetworkLogs: true,
  filterPatterns: ['api/github/pull-requests'], // Focus on PR API calls
  logLevels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO]
});

export const createCarouselTestLogger = () => createTestLogger({
  testName: 'carousel-tests',
  enableBrowserLogs: true,
  enableNetworkLogs: false,
  filterPatterns: ['carousel', 'splide'], // Focus on carousel-related logs
  logLevels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO]
});

export const createFontTestLogger = () => createTestLogger({
  testName: 'font-tests',
  enableBrowserLogs: true,
  enableNetworkLogs: true,
  filterPatterns: ['font', 'typeface'], // Focus on font-related logs
  logLevels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO]
}); 