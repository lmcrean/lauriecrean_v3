import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  // Only using Safari as specified in custom instructions
  projects: [
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3000',
        // Record videos for debugging if tests fail
        video: 'on-first-retry'
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
}); 