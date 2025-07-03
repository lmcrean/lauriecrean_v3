import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: false, // Run sequentially for service management
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Only one worker to avoid port conflicts
  reporter: 'html',
  timeout: 120000, // 2 minutes per test for service startup
  
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