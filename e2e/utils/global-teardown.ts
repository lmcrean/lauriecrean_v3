import { FullConfig } from '@playwright/test';
import { TestCleanup } from './test-cleanup';

async function globalTeardown(config: FullConfig) {
  console.log('\n🏁 All Playwright tests completed');
  
  // Get the cleanup instance from global setup
  const cleanup: TestCleanup = (global as any).__TEST_CLEANUP__;
  
  if (cleanup) {
    console.log('🧹 Running global test cleanup...');
    await cleanup.cleanup();
    console.log('✅ Global cleanup completed');
  } else {
    console.log('⚠️ No cleanup instance found, proceeding with basic cleanup');
  }

  // Force cleanup of any remaining processes
  if (process.platform === 'win32') {
    // Windows-specific cleanup - but don't kill the current process!
    try {
      const { execSync } = await import('child_process');
      // Only kill specific processes, not all node.exe processes
      // Use cmd /c to ensure exit code 0 regardless of taskkill result
      execSync('cmd /c "taskkill /F /IM playwright.exe 2>nul & exit 0"', { stdio: 'pipe' });
    } catch (error) {
      // Ignore errors, just log them
      console.log('Note: Error during Windows process cleanup (this is usually safe to ignore)');
    }
  }

  console.log('🚪 Playwright session finished - exiting cleanly');
  
  // Give a moment for logs to flush, then force exit
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

export default globalTeardown; 