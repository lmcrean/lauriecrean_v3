import { Page, ConsoleMessage } from '@playwright/test';
import winston from 'winston';
import chalk from 'chalk';
import { LogLevel, BrowserLogEntry, LoggerConfig } from './types';

export class BrowserLogger {
  private logger: winston.Logger;
  private config: LoggerConfig;
  private logs: BrowserLogEntry[] = [];
  private currentTestName?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enableBrowserLogs: true,
      enableNetworkLogs: true,
      logToFile: true,
      logToConsole: true,
      logFilePath: 'test-results/browser-logs.json',
      filterPatterns: [],
      logLevels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.LOG],
      ...config
    };

    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        ...(this.config.logToFile ? [
          new winston.transports.File({ 
            filename: this.config.logFilePath,
            options: { flags: 'w' } // Overwrite file on each test run
          })
        ] : []),
        ...(this.config.logToConsole ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          })
        ] : [])
      ]
    });
  }

  setCurrentTest(testName: string) {
    this.currentTestName = testName;
    this.logInfo(`🧪 Starting test: ${testName}`, 'test');
  }

  attachToPage(page: Page) {
    if (!this.config.enableBrowserLogs) return;

    page.on('console', (msg: ConsoleMessage) => {
      this.handleConsoleMessage(msg);
    });

    page.on('pageerror', (error) => {
      this.logError(`❌ Page Error: ${error.message}`, 'browser', {
        stack: error.stack,
        name: error.name
      });
    });

    if (this.config.enableNetworkLogs) {
      page.on('response', (response) => {
        this.logInfo(`📡 Response: ${response.status()} ${response.url()}`, 'network', {
          status: response.status(),
          url: response.url(),
          headers: response.headers()
        });
      });

      page.on('requestfailed', (request) => {
        this.logError(`❌ Request Failed: ${request.url()}`, 'network', {
          url: request.url(),
          method: request.method(),
          error: request.failure()?.errorText
        });
      });
    }
  }

  private handleConsoleMessage(msg: ConsoleMessage) {
    const level = this.mapConsoleType(msg.type());
    
    if (!this.config.logLevels.includes(level)) return;

    const args = msg.args().map(arg => arg.toString());
    const message = msg.text();

    // Apply filter patterns
    if (this.config.filterPatterns && this.config.filterPatterns.length > 0) {
      const shouldFilter = this.config.filterPatterns.some(pattern => 
        message.includes(pattern)
      );
      if (shouldFilter) return;
    }

    const logEntry: BrowserLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: 'browser',
      browserType: 'safari', // Since we only use Safari per instructions
      args,
      testName: this.currentTestName,
      location: {
        url: msg.location().url,
        lineNumber: msg.location().lineNumber,
        columnNumber: msg.location().columnNumber
      }
    };

    this.logs.push(logEntry);

    // Log with color coding based on type
    const coloredMessage = this.colorizeMessage(level, message);
    this.logger.log(level, `🌐 [BROWSER] ${coloredMessage}`, {
      testName: this.currentTestName,
      location: logEntry.location,
      args
    });
  }

  private mapConsoleType(type: string): LogLevel {
    switch (type) {
      case 'error': return LogLevel.ERROR;
      case 'warning': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return LogLevel.LOG;
    }
  }

  private colorizeMessage(level: LogLevel, message: string): string {
    switch (level) {
      case LogLevel.ERROR:
        return chalk.red(message);
      case LogLevel.WARN:
        return chalk.yellow(message);
      case LogLevel.INFO:
        return chalk.blue(message);
      case LogLevel.DEBUG:
        return chalk.gray(message);
      default:
        return chalk.white(message);
    }
  }

  logInfo(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    this.logger.info(`ℹ️ [${source.toUpperCase()}] ${message}`, {
      testName: this.currentTestName,
      ...metadata
    });
  }

  logError(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    this.logger.error(`❌ [${source.toUpperCase()}] ${message}`, {
      testName: this.currentTestName,
      ...metadata
    });
  }

  logWarn(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    this.logger.warn(`⚠️ [${source.toUpperCase()}] ${message}`, {
      testName: this.currentTestName,
      ...metadata
    });
  }

  getLogs(): BrowserLogEntry[] {
    return [...this.logs];
  }

  getLogsForTest(testName: string): BrowserLogEntry[] {
    return this.logs.filter(log => log.testName === testName);
  }

  clearLogs() {
    this.logs = [];
  }

  generateReport(): string {
    const testGroups = new Map<string, BrowserLogEntry[]>();
    
    this.logs.forEach(log => {
      const testName = log.testName || 'Unknown Test';
      if (!testGroups.has(testName)) {
        testGroups.set(testName, []);
      }
      testGroups.get(testName)!.push(log);
    });

    let report = `
# Browser Console Log Report
Generated: ${new Date().toISOString()}
Total Logs: ${this.logs.length}

`;

    for (const [testName, logs] of testGroups) {
      report += `## Test: ${testName}\n`;
      report += `Logs: ${logs.length}\n\n`;
      
      const errorLogs = logs.filter(l => l.level === LogLevel.ERROR);
      const warnLogs = logs.filter(l => l.level === LogLevel.WARN);
      const infoLogs = logs.filter(l => l.level === LogLevel.INFO);

      if (errorLogs.length > 0) {
        report += `### Errors (${errorLogs.length})\n`;
        errorLogs.forEach(log => {
          report += `- ${log.timestamp}: ${log.message}\n`;
        });
        report += '\n';
      }

      if (warnLogs.length > 0) {
        report += `### Warnings (${warnLogs.length})\n`;
        warnLogs.forEach(log => {
          report += `- ${log.timestamp}: ${log.message}\n`;
        });
        report += '\n';
      }

      if (infoLogs.length > 0) {
        report += `### Info (${infoLogs.length})\n`;
        infoLogs.forEach(log => {
          report += `- ${log.timestamp}: ${log.message}\n`;
        });
        report += '\n';
      }
    }

    return report;
  }
} 