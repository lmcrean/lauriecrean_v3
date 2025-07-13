import winston from 'winston';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { LogLevel, LogEntry, LoggerConfig } from './types';

export class E2ELogger {
  private logger: winston.Logger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private startTime: Date;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.startTime = new Date();
    this.config = {
      enableBrowserLogs: true,
      enableNetworkLogs: true,
      logToFile: true,
      logToConsole: true,
      logFilePath: 'test-results/e2e-logs.json',
      filterPatterns: [],
      logLevels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.LOG],
      ...config
    };

    // Ensure test-results directory exists
    const logDir = path.dirname(this.config.logFilePath!);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

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
            options: { flags: 'w' }
          })
        ] : []),
        ...(this.config.logToConsole ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp({ format: 'HH:mm:ss' }),
              winston.format.printf(({ timestamp, level, message }) => {
                const coloredLevel = this.colorizeLevel(level);
                return `${chalk.gray(timestamp)} ${coloredLevel} ${message}`;
              })
            )
          })
        ] : [])
      ]
    });

    this.logTestSuiteStart();
  }

  private colorizeLevel(level: string): string {
    switch (level) {
      case 'error': return chalk.red('ERROR');
      case 'warn': return chalk.yellow('WARN ');
      case 'info': return chalk.blue('INFO ');
      case 'debug': return chalk.gray('DEBUG');
      default: return chalk.white('LOG  ');
    }
  }

  private logTestSuiteStart() {
    this.logInfo('🚀 E2E Test Suite Starting', 'test', {
      startTime: this.startTime.toISOString(),
      config: this.config
    });
  }

  logServiceStart(serviceName: string, port: number, command: string) {
    this.logInfo(`📡 Starting ${serviceName} service on port ${port}`, 'test', {
      service: serviceName,
      port,
      command
    });
  }

  logServiceOutput(serviceName: string, output: string, isError = false) {
    const cleanOutput = output.trim();
    if (!cleanOutput) return;

    const level = isError ? LogLevel.ERROR : LogLevel.INFO;
    const emoji = isError ? '❌' : '📝';
    
    this.logger.log(level, `${emoji} [${serviceName.toUpperCase()}] ${cleanOutput}`, {
      service: serviceName,
      isError
    });
  }

  logServiceStop(serviceName: string) {
    this.logInfo(`🛑 ${serviceName} service stopped`, 'test', {
      service: serviceName
    });
  }

  logTestStart(testName: string) {
    this.logInfo(`🧪 Test Started: ${testName}`, 'test', {
      testName,
      timestamp: new Date().toISOString()
    });
  }

  logTestEnd(testName: string, passed: boolean, duration?: number) {
    const emoji = passed ? '✅' : '❌';
    const status = passed ? 'PASSED' : 'FAILED';
    const durationText = duration ? ` (${duration}ms)` : '';
    
    this.logInfo(`${emoji} Test ${status}: ${testName}${durationText}`, 'test', {
      testName,
      passed,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  logInfo(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      source,
      metadata
    };
    
    this.logs.push(logEntry);
    this.logger.info(message, metadata);
  }

  logError(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      source,
      metadata
    };
    
    this.logs.push(logEntry);
    this.logger.error(message, metadata);
  }

  logWarn(message: string, source: 'test' | 'browser' | 'network', metadata?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      source,
      metadata
    };
    
    this.logs.push(logEntry);
    this.logger.warn(message, metadata);
  }

  logNetworkActivity(url: string, method: string, status: number, responseTime?: number) {
    const emoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    this.logInfo(`${emoji} ${method} ${status} ${url}${responseTime ? ` (${responseTime}ms)` : ''}`, 'network', {
      url,
      method,
      status,
      responseTime
    });
  }

  logBrowserConsole(level: LogLevel, message: string, url?: string, testName?: string) {
    const emoji = level === LogLevel.ERROR ? '❌' : 
                  level === LogLevel.WARN ? '⚠️' : 
                  level === LogLevel.INFO ? 'ℹ️' : '📝';
    
    this.logger.log(level, `${emoji} [BROWSER] ${message}`, {
      testName,
      url
    });
  }

  finalize() {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();
    
    this.logInfo(`🏁 E2E Test Suite Completed`, 'test', {
      endTime: endTime.toISOString(),
      duration,
      totalLogs: this.logs.length
    });

    // Generate summary report
    this.generateSummaryReport();
  }

  private generateSummaryReport() {
    const errorLogs = this.logs.filter(l => l.level === LogLevel.ERROR);
    const warnLogs = this.logs.filter(l => l.level === LogLevel.WARN);
    const testLogs = this.logs.filter(l => l.source === 'test');
    const browserLogs = this.logs.filter(l => l.source === 'browser');
    const networkLogs = this.logs.filter(l => l.source === 'network');

    const summary = {
      summary: {
        startTime: this.startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: new Date().getTime() - this.startTime.getTime(),
        totalLogs: this.logs.length,
        errors: errorLogs.length,
        warnings: warnLogs.length
      },
      breakdown: {
        test: testLogs.length,
        browser: browserLogs.length,
        network: networkLogs.length
      },
      errors: errorLogs.map(log => ({
        timestamp: log.timestamp,
        message: log.message,
        source: log.source,
        metadata: log.metadata
      })),
      warnings: warnLogs.map(log => ({
        timestamp: log.timestamp,
        message: log.message,
        source: log.source,
        metadata: log.metadata
      }))
    };

    // Write summary to file
    const summaryPath = this.config.logFilePath!.replace('.json', '-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    // Log summary to console
    console.log('\n' + '='.repeat(60));
    console.log(chalk.bold.blue('📊 E2E Test Suite Summary'));
    console.log('='.repeat(60));
    console.log(`Duration: ${summary.summary.duration}ms`);
    console.log(`Total Logs: ${summary.summary.totalLogs}`);
    console.log(`Errors: ${chalk.red(summary.summary.errors)}`);
    console.log(`Warnings: ${chalk.yellow(summary.summary.warnings)}`);
    console.log(`Test Logs: ${summary.breakdown.test}`);
    console.log(`Browser Logs: ${summary.breakdown.browser}`);
    console.log(`Network Logs: ${summary.breakdown.network}`);
    console.log('='.repeat(60));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsForSource(source: 'test' | 'browser' | 'network'): LogEntry[] {
    return this.logs.filter(log => log.source === source);
  }
} 