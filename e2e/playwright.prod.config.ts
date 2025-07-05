import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: 'html',
  
  // Only using Safari as specified in custom instructions
  projects: [
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: 'https://lauriecrean.dev',
        // Record videos for debugging if tests fail
        video: 'on-first-retry',
        // Set a longer timeout for network operations in production
        navigationTimeout: 60000,
        // Keep screenshot on failure
        screenshot: 'only-on-failure'
      },
    },
  ],
  
  // No need for webServer as we're testing production
}); 