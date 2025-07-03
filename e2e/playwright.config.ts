import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { 
      open: 'never', // Don't automatically open browser
      host: 'localhost',
      port: 0 // Use random available port
    }]
  ],
  
  // Global setup and teardown hooks
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'utils/global-teardown.ts'),
  
  // Only using Safari as specified in custom instructions
  projects: [
    {
      name: 'safari',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:3010',
        // Record videos for debugging if tests fail
        video: 'on-first-retry'
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'cd ../apps/web && npm run start -- --port 3010',
    url: 'http://localhost:3010',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
}); 