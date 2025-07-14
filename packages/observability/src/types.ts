export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  LOG = 'log'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source: 'test' | 'browser' | 'network';
  testName?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface BrowserLogEntry extends LogEntry {
  source: 'browser';
  browserType: string;
  args: any[];
  location?: {
    url: string;
    lineNumber?: number;
    columnNumber?: number;
  };
}

export interface NetworkLogEntry extends LogEntry {
  source: 'network';
  method: string;
  status: number;
  responseTime?: number;
  error?: string;
}

export interface LoggerConfig {
  enableBrowserLogs: boolean;
  enableNetworkLogs: boolean;
  logToFile: boolean;
  logToConsole: boolean;
  logFilePath?: string;
  filterPatterns?: string[];
  logLevels: LogLevel[];
} 