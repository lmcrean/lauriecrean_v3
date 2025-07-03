import { spawn, ChildProcess } from 'child_process';
import { E2ELogger } from '@lauriecrean/observability';
import { createTestCleanup, TestCleanup } from '../../../../../../utils/test-cleanup';

export interface ServiceManagerConfig {
  webPort: number;
  apiPort: number;
  startupWaitTime: number;
  logFilePath: string;
}

export class ServiceManager {
  private webProcess: ChildProcess | null = null;
  private apiProcess: ChildProcess | null = null;
  private logger: E2ELogger;
  private cleanup: TestCleanup;
  private config: ServiceManagerConfig;

  constructor(config: ServiceManagerConfig) {
    this.config = config;
    
    // Initialize test cleanup utility
    this.cleanup = createTestCleanup({
      exitAfterCleanup: false, // Don't exit automatically in test context
      logCleanupSteps: true,
      forceKillTimeout: 5000
    });

    // Initialize observability logger
    this.logger = new E2ELogger({
      enableBrowserLogs: true,
      enableNetworkLogs: true,
      logToFile: true,
      logToConsole: true,
      logFilePath: config.logFilePath
    });

    // Register logger finalization as cleanup handler
    this.cleanup.registerCleanupHandler(async () => {
      this.logger.finalize();
    });
  }

  async startServices(): Promise<void> {
    this.logger.logInfo('🚀 Starting both web and API services...', 'service-manager');
    
    await this.startApiService();
    await this.startWebService();
    
    // Wait for services to start
    this.logger.logInfo('⏳ Waiting for services to start...', 'service-manager');
    await new Promise(resolve => setTimeout(resolve, this.config.startupWaitTime));
  }

  private async startApiService(): Promise<void> {
    this.logger.logServiceStart('API', this.config.apiPort, 'npm run dev');
    this.apiProcess = spawn('powershell.exe', ['-Command', 'cd ../apps/api-github; npm run dev'], {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env, PORT: this.config.apiPort.toString() }
    });
    
    this.cleanup.registerProcess(this.apiProcess, 'API Server');
    
    this.apiProcess.stdout?.on('data', (data) => {
      this.logger.logServiceOutput('API', data.toString());
    });
    
    this.apiProcess.stderr?.on('data', (data) => {
      this.logger.logServiceOutput('API', data.toString(), true);
    });
  }

  private async startWebService(): Promise<void> {
    this.logger.logServiceStart('WEB', this.config.webPort, `npm run start -- --port ${this.config.webPort}`);
    this.webProcess = spawn('powershell.exe', ['-Command', `cd ../apps/web; npm run start -- --port ${this.config.webPort}`], {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe']
    });
    
    this.cleanup.registerProcess(this.webProcess, 'Web Server');
    
    this.webProcess.stdout?.on('data', (data) => {
      this.logger.logServiceOutput('WEB', data.toString());
    });
    
    this.webProcess.stderr?.on('data', (data) => {
      this.logger.logServiceOutput('WEB', data.toString(), true);
    });
  }

  async performHealthChecks(): Promise<{ apiHealthy: boolean; webHealthy: boolean }> {
    let apiHealthy = false;
    let webHealthy = false;

    // Health check for API
    try {
      const response = await fetch(`http://localhost:${this.config.apiPort}/health`);
      if (response.ok) {
        const health = await response.json();
        this.logger.logInfo('✅ API health check passed', 'service-manager', { health });
        apiHealthy = true;
      } else {
        this.logger.logError('❌ API health check failed', 'service-manager', { status: response.status });
      }
    } catch (error: any) {
      this.logger.logError('❌ API health check error', 'service-manager', { error: error.message });
    }
    
    // Health check for web server
    try {
      const response = await fetch(`http://localhost:${this.config.webPort}`);
      if (response.ok) {
        this.logger.logInfo('✅ Web server health check passed', 'service-manager');
        webHealthy = true;
      } else {
        this.logger.logError('❌ Web server health check failed', 'service-manager', { status: response.status });
      }
    } catch (error: any) {
      this.logger.logError('❌ Web server health check error', 'service-manager', { error: error.message });
    }

    return { apiHealthy, webHealthy };
  }

  async stopServices(): Promise<void> {
    this.logger.logInfo('🛑 Starting comprehensive cleanup...', 'service-manager');
    await this.cleanup.cleanup();
    this.logger.logInfo('✅ All services stopped and cleanup completed', 'service-manager');
  }

  getLogger(): E2ELogger {
    return this.logger;
  }

  getWebPort(): number {
    return this.config.webPort;
  }

  getApiPort(): number {
    return this.config.apiPort;
  }
} 