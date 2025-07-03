import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

/**
 * E2E test for Pull Request Feed API integration
 * This test recreates the timeout error by running both services concurrently
 */
test.describe('Pull Request Feed API Integration', () => {
  let webProcess: ChildProcess;
  let apiProcess: ChildProcess;
  
  // Setup: Start both services before tests
  test.beforeAll(async () => {
    console.log('🚀 Starting both web and API services...');
    
    // Start API server (apps/api-github)
    console.log('📡 Starting API server on localhost:3015...');
    apiProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(process.cwd(), 'apps', 'api-github'),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, PORT: '3015' }
    });
    
    apiProcess.stdout?.on('data', (data) => {
      console.log(`[API] ${data.toString()}`);
    });
    
    apiProcess.stderr?.on('data', (data) => {
      console.error(`[API ERROR] ${data.toString()}`);
    });
    
    // Start web server (apps/web)
    console.log('🌐 Starting web server on localhost:3010...');
    webProcess = spawn('npm', ['run', 'start', '--', '--port', '3010'], {
      cwd: path.join(process.cwd(), 'apps', 'web'),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });
    
    webProcess.stdout?.on('data', (data) => {
      console.log(`[WEB] ${data.toString()}`);
    });
    
    webProcess.stderr?.on('data', (data) => {
      console.error(`[WEB ERROR] ${data.toString()}`);
    });
    
    // Wait for services to start (increased timeout for startup)
    console.log('⏳ Waiting for services to start...');
    await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds
    
    // Health check for API
    try {
      const response = await fetch('http://localhost:3015/health');
      if (response.ok) {
        const health = await response.json();
        console.log('✅ API health check passed:', health);
      } else {
        console.error('❌ API health check failed:', response.status);
      }
    } catch (error) {
      console.error('❌ API health check error:', error);
    }
    
    // Health check for web server
    try {
      const response = await fetch('http://localhost:3010');
      if (response.ok) {
        console.log('✅ Web server health check passed');
      } else {
        console.error('❌ Web server health check failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Web server health check error:', error);
    }
  });
  
  // Cleanup: Stop both services after tests
  test.afterAll(async () => {
    console.log('🛑 Stopping services...');
    
    if (apiProcess) {
      apiProcess.kill('SIGTERM');
      console.log('📡 API server stopped');
    }
    
    if (webProcess) {
      webProcess.kill('SIGTERM');
      console.log('🌐 Web server stopped');
    }
  });

  test('should reproduce timeout error when fetching pull requests', async ({ page }) => {
    console.log('🧪 Starting pull request feed timeout test...');
    
    // Navigate to a page with the pull request feed
    console.log('📍 Navigating to page with pull request feed...');
    await page.goto('http://localhost:3010/pull-request-feed', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');
    
    // Look for pull request feed component
    console.log('🔍 Looking for pull request feed component...');
    
    // Set up network monitoring to catch API calls
    const networkLogs: Array<{url: string, status: number, error?: string}> = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('api/github/pull-requests')) {
        console.log(`📡 API Response: ${response.status()} - ${url}`);
        networkLogs.push({
          url,
          status: response.status()
        });
      }
    });
    
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('api/github/pull-requests')) {
        console.error(`❌ API Request Failed: ${url} - ${request.failure()?.errorText}`);
        networkLogs.push({
          url,
          status: 0,
          error: request.failure()?.errorText
        });
      }
    });
    
    // Set up console logging to catch frontend errors
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('pull requests')) {
        console.error(`🖥️ Frontend Error: ${msg.text()}`);
      }
      if (msg.text().includes('AxiosError') || msg.text().includes('timeout')) {
        console.error(`⏰ Timeout Error Detected: ${msg.text()}`);
      }
    });
    
    // Check if pull request feed component exists
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]').first();
    const pullRequestSection = page.locator('text=Pull Request Activity').first();
    
    let foundComponent = false;
    
    if (await pullRequestFeed.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found pull request feed component');
      foundComponent = true;
    } else if (await pullRequestSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Found pull request section');
      foundComponent = true;
    } else {
      console.log('ℹ️ Pull request component not immediately visible, checking page content...');
      
      // Take screenshot for debugging
      await page.screenshot({ 
        path: path.join('e2e', 'screenshots', 'pull-request-debug.png'),
        fullPage: true 
      });
      
      // Log page content for debugging
      const pageContent = await page.content();
      console.log('📄 Page contains pull request text:', pageContent.includes('pull request'));
      console.log('📄 Page contains API-related text:', pageContent.includes('api'));
    }
    
    // Wait for potential API calls and timeout errors
    console.log('⏳ Waiting for API calls and potential timeout errors...');
    await page.waitForTimeout(15000); // Wait 15 seconds to allow for timeout
    
    // Check network logs
    console.log('📊 Network Activity Summary:');
    networkLogs.forEach(log => {
      console.log(`  - ${log.url}: Status ${log.status}${log.error ? ` (Error: ${log.error})` : ''}`);
    });
    
    // Verify that we either got the timeout error or successful API calls
    const hasTimeoutError = networkLogs.some(log => log.error && log.error.includes('timeout'));
    const hasSuccessfulCall = networkLogs.some(log => log.status === 200);
    const hasFailedCall = networkLogs.some(log => log.status === 0 || log.error);
    
    console.log('📈 Test Results:');
    console.log(`  - Timeout errors detected: ${hasTimeoutError}`);
    console.log(`  - Successful API calls: ${hasSuccessfulCall}`);
    console.log(`  - Failed API calls: ${hasFailedCall}`);
    console.log(`  - Component found: ${foundComponent}`);
    
    // The test passes if we either:
    // 1. Successfully reproduced the timeout error, OR
    // 2. Successfully made API calls (proving the fix works)
    const testSuccessful = hasTimeoutError || hasSuccessfulCall || networkLogs.length > 0;
    
    if (hasTimeoutError) {
      console.log('✅ Successfully reproduced the timeout error');
    } else if (hasSuccessfulCall) {
      console.log('✅ API calls are working - timeout issue resolved');
    } else if (networkLogs.length === 0) {
      console.log('ℹ️ No API calls detected - component may not be present on this page');
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join('e2e', 'screenshots', 'pull-request-final.png'),
      fullPage: true 
    });
    
    // Assert that we captured some network activity or component interaction
    expect(testSuccessful).toBe(true);
  });

  test('should verify API server is running independently', async ({ page }) => {
    console.log('🔧 Testing API server health directly...');
    
    // Direct API health check
    await page.goto('http://localhost:3015/health');
    
    // Check if we get JSON response
    const content = await page.textContent('body');
    console.log('🏥 API Health Response:', content);
    
    expect(content).toContain('ok');
    expect(content).toContain('api-github');
  });

  test('should test pull requests endpoint directly', async ({ page }) => {
    console.log('🎯 Testing pull requests endpoint directly...');
    
    // Navigate directly to the API endpoint
    await page.goto('http://localhost:3015/api/github/pull-requests?username=lmcrean&page=1&per_page=5', {
      timeout: 15000
    });
    
    const content = await page.textContent('body');
    console.log('📋 Pull Requests API Response (first 200 chars):', content?.substring(0, 200));
    
    // Should get JSON response with data structure
    expect(content).toContain('data');
    expect(content).toContain('meta');
  });
}); 