import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './',
  fullyParallel: false, // Run sequentially for service management
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Only one worker to avoid port conflicts
  reporter: [
    ['html', { 
      open: 'never', // Don't automatically open browser
      host: 'localhost',
      port: 0 // Use random available port
    }]
  ],
  timeout: 120000, // 2 minutes per test for service startup
  
  // Global setup and teardown hooks
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'utils/global-teardown.ts'),
  
  // Only using Safari as specified in custom instructions
  projects: [
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        // No base URL since we'll manage servers manually
        video: 'on-first-retry',
        // Increased timeouts for service startup
        actionTimeout: 30000,
        navigationTimeout: 30000
      },
    },
  ],

  // No webServer config - tests will manage services manually
}); 