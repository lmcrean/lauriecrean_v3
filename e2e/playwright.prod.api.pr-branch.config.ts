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
      open: 'never',
      host: 'localhost',
      port: 0
    }],
    ['list'] // Better for CI/API testing
  ],
  
  // Global setup and teardown hooks
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'utils/global-teardown.ts'),
  
  // API tests don't need specific browsers - just use one for the request context
  projects: [
    {
      name: 'api',
      use: { 
        // No baseURL - API tests will use their own deployed URLs
        // Record artifacts for debugging if tests fail
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
    },
  ],

  // NO webServer needed for pure API tests!
  // API tests will hit deployed endpoints directly
}); 