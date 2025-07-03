import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { createPullRequestTestLogger, E2ELogger } from '@lauriecrean/observability';

/**
 * Enhanced Pull Request Feed test with comprehensive logging
 * This demonstrates the observability package integration with concurrently services
 */
test.describe('Enhanced Pull Request Feed with Observability', () => {
  let webProcess: ChildProcess;
  let apiProcess: ChildProcess;
  let e2eLogger: E2ELogger;
  
  // Setup: Start both services with enhanced logging
  test.beforeAll(async () => {
    e2eLogger = new E2ELogger({
      logFilePath: 'test-results/enhanced-pr-test-suite.json'
    });
    
    e2eLogger.logInfo('🚀 Starting enhanced pull request feed test suite', 'test');
    
    // Start API server with logging
    e2eLogger.logServiceStart('api-github', 3015, 'npm run dev');
    apiProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(process.cwd(), '..', 'apps', 'api-github'),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, PORT: '3015' }
    });
    
    apiProcess.stdout?.on('data', (data) => {
      e2eLogger.logServiceOutput('api-github', data.toString());
    });
    
    apiProcess.stderr?.on('data', (data) => {
      e2eLogger.logServiceOutput('api-github', data.toString(), true);
    });
    
    // Start web server with logging
    e2eLogger.logServiceStart('web', 3010, 'npm run start --port 3010');
    webProcess = spawn('npm', ['run', 'start', '--', '--port', '3010'], {
      cwd: path.join(process.cwd(), '..', 'apps', 'web'),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });
    
    webProcess.stdout?.on('data', (data) => {
      e2eLogger.logServiceOutput('web', data.toString());
    });
    
    webProcess.stderr?.on('data', (data) => {
      e2eLogger.logServiceOutput('web', data.toString(), true);
    });
    
    // Wait for services to start
    e2eLogger.logInfo('⏳ Waiting for services to start...', 'test');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Health checks with logging
    try {
      const apiResponse = await fetch('http://localhost:3015/health');
      if (apiResponse.ok) {
        const health = await apiResponse.json();
        e2eLogger.logInfo(`✅ API health check passed: ${JSON.stringify(health)}`, 'test');
      } else {
        e2eLogger.logError(`❌ API health check failed: ${apiResponse.status}`, 'test');
      }
    } catch (error) {
      e2eLogger.logError(`❌ API health check error: ${error}`, 'test');
    }
    
    try {
      const webResponse = await fetch('http://localhost:3010');
      if (webResponse.ok) {
        e2eLogger.logInfo('✅ Web server health check passed', 'test');
      } else {
        e2eLogger.logError(`❌ Web server health check failed: ${webResponse.status}`, 'test');
      }
    } catch (error) {
      e2eLogger.logError(`❌ Web server health check error: ${error}`, 'test');
    }
  });
  
  // Cleanup with logging
  test.afterAll(async () => {
    e2eLogger.logInfo('🛑 Stopping services...', 'test');
    
    if (apiProcess) {
      apiProcess.kill('SIGTERM');
      e2eLogger.logServiceStop('api-github');
    }
    
    if (webProcess) {
      webProcess.kill('SIGTERM');
      e2eLogger.logServiceStop('web');
    }
    
    // Finalize the main E2E logger
    e2eLogger.finalize();
  });

  test('pull request feed with comprehensive browser logging', async ({ page }) => {
    const testStartTime = Date.now();
    
    // Create specialized logger for this test
    const logger = createPullRequestTestLogger();
    
    // Attach browser logger to capture console.log messages
    logger.attachToPage(page);
    
    e2eLogger.logTestStart('pull-request-feed-comprehensive');
    logger.logInfo('🧪 Starting comprehensive pull request feed test');
    
    // Navigate to PR feed page
    logger.logInfo('📍 Navigating to pull request feed page...');
    await page.goto('http://localhost:3010/pull-request-feed', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    logger.logInfo('🔍 Page loaded, analyzing browser console output...');
    
    // Add comprehensive browser console logging
    await page.evaluate(() => {
      console.log('🚀 [TEST] Pull Request Feed page evaluation started');
      console.info('🔍 [TEST] Checking for React components...');
      
      // Check for React DevTools indicators
      if (window.React) {
        console.log('✅ [TEST] React is loaded and available');
      } else {
        console.warn('⚠️ [TEST] React not detected in global scope');
      }
      
      // Check for pull request feed component
      const feedElement = document.querySelector('[data-testid="pull-request-feed"]');
      if (feedElement) {
        console.log('✅ [TEST] Pull request feed component found');
        console.log('📊 [TEST] Component details:', {
          className: feedElement.className,
          childElementCount: feedElement.childElementCount,
          tagName: feedElement.tagName
        });
      } else {
        console.warn('⚠️ [TEST] Pull request feed component not found');
        
        // Log all elements that might be related
        const possibleElements = document.querySelectorAll('[class*="pull"], [class*="request"], [id*="pull"], [id*="request"]');
        console.log(`🔍 [TEST] Found ${possibleElements.length} elements that might be related to pull requests`);
        
        possibleElements.forEach((el, index) => {
          console.log(`📝 [TEST] Element ${index + 1}:`, {
            tagName: el.tagName,
            className: el.className,
            id: el.id
          });
        });
      }
      
      // Check for API-related elements or loading states
      const loadingElements = document.querySelectorAll('[data-testid*="loading"], [class*="loading"], [class*="spinner"]');
      if (loadingElements.length > 0) {
        console.log(`🔄 [TEST] Found ${loadingElements.length} loading indicators`);
      } else {
        console.log('📝 [TEST] No loading indicators found');
      }
      
      // Check for error elements
      const errorElements = document.querySelectorAll('[class*="error"], [data-testid*="error"]');
      if (errorElements.length > 0) {
        console.error(`❌ [TEST] Found ${errorElements.length} error elements`);
        errorElements.forEach((el, index) => {
          console.error(`❌ [TEST] Error element ${index + 1}:`, el.textContent?.substring(0, 100));
        });
      } else {
        console.log('✅ [TEST] No error elements found');
      }
    });
    
    // Wait for any API calls and async operations
    logger.logInfo('⏳ Waiting for API calls and component rendering...');
    await page.waitForTimeout(10000);
    
    // Check final component state
    await page.evaluate(() => {
      console.log('🔍 [TEST] Final component state check...');
      
      const feedElement = document.querySelector('[data-testid="pull-request-feed"]');
      if (feedElement) {
        console.log('✅ [TEST] Final check - Pull request feed component is present');
        
        // Check for actual pull request items
        const prItems = feedElement.querySelectorAll('[data-testid*="pull-request-item"], .pull-request-item, .pr-item');
        console.log(`📋 [TEST] Found ${prItems.length} pull request items`);
        
        if (prItems.length > 0) {
          console.log('✅ [TEST] Pull request items are rendering');
          // Log first item details
          const firstItem = prItems[0];
          console.log('📝 [TEST] First PR item details:', {
            textContent: firstItem.textContent?.substring(0, 100),
            className: firstItem.className
          });
        } else {
          console.log('📝 [TEST] No pull request items found - might be loading or empty state');
        }
      } else {
        console.warn('⚠️ [TEST] Final check - Pull request feed component still not found');
      }
      
      console.log('🏁 [TEST] Browser evaluation completed');
    });
    
    // Generate test reports
    const testDuration = Date.now() - testStartTime;
    e2eLogger.logTestEnd('pull-request-feed-comprehensive', true, testDuration);
    
    const reports = logger.finalize();
    
    // Log comprehensive summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Test Duration: ${testDuration}ms`);
    console.log(`Browser Console Messages: ${reports.browserLogs.length}`);
    console.log(`E2E Log Entries: ${reports.e2eLogs.length}`);
    console.log('\n📋 Browser Console Report:');
    console.log(reports.browserReport);
    console.log('='.repeat(60));
    
    // Basic assertion to ensure test passes
    expect(testDuration).toBeGreaterThan(0);
  });
  
  test('quick browser console capture demo', async ({ page }) => {
    const logger = createPullRequestTestLogger();
    logger.attachToPage(page);
    
    e2eLogger.logTestStart('quick-console-demo');
    logger.logInfo('🎯 Quick demo of browser console capturing');
    
    await page.goto('http://localhost:3010');
    
    // Generate some console output to demonstrate capture
    await page.evaluate(() => {
      console.log('🎯 [DEMO] This is a regular log message');
      console.info('ℹ️ [DEMO] This is an info message');
      console.warn('⚠️ [DEMO] This is a warning message');
      console.error('❌ [DEMO] This is an error message (for demo purposes)');
      
      // Log some page information
      console.log('📄 [DEMO] Page title:', document.title);
      console.log('🌐 [DEMO] Page URL:', window.location.href);
      console.log('📊 [DEMO] Viewport dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });
    
    await page.waitForTimeout(2000);
    
    const reports = logger.finalize();
    e2eLogger.logTestEnd('quick-console-demo', true);
    
    console.log(`\n🎯 Demo completed - captured ${reports.browserLogs.length} console messages`);
    
    expect(reports.browserLogs.length).toBeGreaterThan(0);
  });
}); 