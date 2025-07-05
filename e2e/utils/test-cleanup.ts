import { ChildProcess } from 'child_process';

export interface TestCleanupOptions {
  exitAfterCleanup?: boolean;
  logCleanupSteps?: boolean;
  forceKillTimeout?: number;
}

export class TestCleanup {
  private processes: ChildProcess[] = [];
  private cleanupHandlers: (() => Promise<void> | void)[] = [];
  private options: TestCleanupOptions;

  constructor(options: TestCleanupOptions = {}) {
    this.options = {
      exitAfterCleanup: true,
      logCleanupSteps: true,
      forceKillTimeout: 5000,
      ...options
    };

    // Register global cleanup handlers
    process.on('SIGINT', () => this.handleExit('SIGINT'));
    process.on('SIGTERM', () => this.handleExit('SIGTERM'));
    process.on('beforeExit', () => this.handleExit('beforeExit'));
  }

  /**
   * Register a process to be cleaned up
   */
  registerProcess(process: ChildProcess, name?: string): void {
    this.processes.push(process);
    if (this.options.logCleanupSteps && name) {
      console.log(`📝 Registered process for cleanup: ${name}`);
    }
  }

  /**
   * Register a custom cleanup handler
   */
  registerCleanupHandler(handler: (() => Promise<void> | void)): void {
    this.cleanupHandlers.push(handler);
    if (this.options.logCleanupSteps) {
      console.log('📝 Registered custom cleanup handler');
    }
  }

  /**
   * Manually trigger cleanup (useful for test completion)
   */
  async cleanup(): Promise<void> {
    if (this.options.logCleanupSteps) {
      console.log('\n🧹 Starting test cleanup...');
    }

    // Run custom cleanup handlers first
    for (const handler of this.cleanupHandlers) {
      try {
        await handler();
      } catch (error) {
        console.error('❌ Error in custom cleanup handler:', error.message);
      }
    }

    // Kill all registered processes
    const killPromises = this.processes.map(async (proc, index) => {
      if (!proc.killed && proc.pid) {
        try {
          if (this.options.logCleanupSteps) {
            console.log(`🛑 Terminating process ${proc.pid}...`);
          }
          
          proc.kill('SIGTERM');
          
          // Force kill after timeout if needed
          setTimeout(() => {
            if (!proc.killed && proc.pid) {
              if (this.options.logCleanupSteps) {
                console.log(`⚡ Force killing process ${proc.pid}...`);
              }
              proc.kill('SIGKILL');
            }
          }, this.options.forceKillTimeout);

        } catch (error) {
          console.error(`❌ Error killing process ${proc.pid}:`, error.message);
        }
      }
    });

    await Promise.all(killPromises);

    if (this.options.logCleanupSteps) {
      console.log('✅ Cleanup completed');
    }
  }

  /**
   * Complete test execution with cleanup and optional exit
   */
  async finishTest(testName?: string): Promise<void> {
    const name = testName || 'Playwright test';
    
    console.log(`\n🏁 ${name} finished...`);
    
    await this.cleanup();
    
    console.log('🧹 Test cleanup completed');
    
    if (this.options.exitAfterCleanup) {
      console.log('🚪 Test finished...exiting terminal');
      
      // Give a small delay for logs to flush
      setTimeout(() => {
        process.exit(0);
      }, 100);
    }
  }

  /**
   * Handle unexpected exit signals
   */
  private async handleExit(signal: string): Promise<void> {
    if (this.options.logCleanupSteps) {
      console.log(`\n⚠️ Received ${signal}, cleaning up...`);
    }
    
    await this.cleanup();
    
    if (signal !== 'beforeExit') {
      process.exit(0);
    }
  }
}

/**
 * Convenience function to create and configure test cleanup
 */
export function createTestCleanup(options?: TestCleanupOptions): TestCleanup {
  return new TestCleanup(options);
}

/**
 * Quick cleanup utility for simple test scenarios
 */
export async function quickCleanupAndExit(
  processes: ChildProcess[] = [], 
  testName?: string
): Promise<void> {
  const cleanup = createTestCleanup();
  
  processes.forEach(proc => cleanup.registerProcess(proc));
  
  await cleanup.finishTest(testName);
} 