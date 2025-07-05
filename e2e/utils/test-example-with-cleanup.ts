/**
 * Example of how to use the test cleanup utility in Playwright tests
 * This demonstrates how to register processes and cleanup handlers for individual tests
 */

import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import { TestCleanup } from './test-cleanup';

// Example test that starts external processes and needs cleanup
test.describe('Example with Test Cleanup', () => {
  let testCleanup: TestCleanup;

  test.beforeEach(async () => {
    // Create a test-specific cleanup instance
    testCleanup = new TestCleanup({
      exitAfterCleanup: false, // Let Playwright manage the test lifecycle
      logCleanupSteps: true,
      forceKillTimeout: 3000
    });
  });

  test.afterEach(async () => {
    // Clean up after each test
    if (testCleanup) {
      await testCleanup.cleanup();
    }
  });

  test('should manage external processes with cleanup', async () => {
    // Example: Start an external process that needs cleanup
    const serverProcess = spawn('node', ['-e', 'console.log("Test server running"); setInterval(() => {}, 1000)']);
    
    // Register the process for cleanup
    testCleanup.registerProcess(serverProcess, 'Test Server');

    // Register a custom cleanup handler
    testCleanup.registerCleanupHandler(async () => {
      console.log('🧹 Running custom cleanup logic...');
      // Your custom cleanup code here
    });

    // Your test logic here
    expect(true).toBe(true);
    
    // The cleanup will happen automatically in afterEach
  });

  test('should handle multiple processes with cleanup', async () => {
    // Start multiple processes
    const process1 = spawn('node', ['-e', 'setInterval(() => console.log("Process 1"), 2000)']);
    const process2 = spawn('node', ['-e', 'setInterval(() => console.log("Process 2"), 3000)']);

    // Register both processes
    testCleanup.registerProcess(process1, 'Background Process 1');
    testCleanup.registerProcess(process2, 'Background Process 2');

    // Your test logic here
    expect(true).toBe(true);
    
    // Both processes will be cleaned up automatically
  });
});

// Example of using the global cleanup instance
test.describe('Example with Global Cleanup', () => {
  
  test('should use global cleanup instance', async () => {
    // Access the global cleanup instance set up in global-setup.ts
    const globalCleanup = (global as any).__TEST_CLEANUP__;
    
    if (globalCleanup) {
      // Start a process and register it with global cleanup
      const tempProcess = spawn('node', ['-e', 'setInterval(() => {}, 1000)']);
      globalCleanup.registerProcess(tempProcess, 'Global Test Process');
      
      // Register a global cleanup handler
      globalCleanup.registerCleanupHandler(() => {
        console.log('🧹 Custom global cleanup executed');
      });
    }

    // Your test logic here
    expect(true).toBe(true);
    
    // This process will be cleaned up in the global teardown
  });
});

export { TestCleanup }; 