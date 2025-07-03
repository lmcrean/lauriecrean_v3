import { E2ELogger } from '@lauriecrean/observability';
import path from 'path';

export interface ServiceManagerConfig {
  webPort: number;
  apiPort: number;
  startupWaitTime: number;
  logFilePath: string;
}

export class ServiceManager {
  private logger: E2ELogger;
  private config: ServiceManagerConfig;

  constructor(config: ServiceManagerConfig) {
    this.config = config;
    this.logger = new E2ELogger('ServiceManager', config.logFilePath);
  }

  getLogger(): E2ELogger {
    return this.logger;
  }

  async startServices(): Promise<void> {
    this.logger.logInfo('🚀 Starting services...', 'service-manager');
    
    // Services are started by concurrently in the npm script
    // This method just waits for them to be ready
    await this.waitForStartup();
  }

  async performHealthChecks(): Promise<void> {
    this.logger.logInfo('🔍 Performing health checks...', 'service-manager');
    
    // Check API service
    await this.checkApiHealth();
    
    // Check web service
    await this.checkWebHealth();
  }

  async stopServices(): Promise<void> {
    this.logger.logInfo('🛑 Services will be stopped by concurrently', 'service-manager');
    // Services are stopped by concurrently when tests complete
  }

  private async waitForStartup(): Promise<void> {
    this.logger.logInfo(`⏳ Waiting ${this.config.startupWaitTime}ms for services to start...`, 'service-manager');
    await new Promise(resolve => setTimeout(resolve, this.config.startupWaitTime));
  }

  private async checkApiHealth(): Promise<void> {
    try {
      const response = await fetch(`http://localhost:${this.config.apiPort}/health`);
      if (response.ok) {
        this.logger.logInfo('✅ API service health check passed', 'service-manager');
      } else {
        this.logger.logWarn(`⚠️ API service health check failed: ${response.status}`, 'service-manager');
      }
    } catch (error: any) {
      this.logger.logWarn(`⚠️ API service not ready yet: ${error.message}`, 'service-manager');
    }
  }

  private async checkWebHealth(): Promise<void> {
    try {
      const response = await fetch(`http://localhost:${this.config.webPort}`);
      if (response.ok) {
        this.logger.logInfo('✅ Web service health check passed', 'service-manager');
      } else {
        this.logger.logWarn(`⚠️ Web service health check failed: ${response.status}`, 'service-manager');
      }
    } catch (error: any) {
      this.logger.logWarn(`⚠️ Web service not ready yet: ${error.message}`, 'service-manager');
    }
  }
} 