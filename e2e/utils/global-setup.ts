import { FullConfig } from '@playwright/test';
import { createTestCleanup } from './test-cleanup';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright test session...');
  
  // Initialize global cleanup system
  const cleanup = createTestCleanup({
    exitAfterCleanup: false, // Let Playwright handle the exit
    logCleanupSteps: true,
    forceKillTimeout: 3000
  });

  // Store cleanup instance globally for access in teardown
  (global as any).__TEST_CLEANUP__ = cleanup;

  console.log('✅ Global setup completed');
}

export default globalSetup; 