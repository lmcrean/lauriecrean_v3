import { test, expect } from '@playwright/test';
import { createTestLogger, createPullRequestTestLogger } from '../packages/observability/src';

/**
 * Example e2e test demonstrating the observability logging integration
 * This shows how to capture console.log messages from the web app during testing
 */
test.describe('Observability Logging Examples', () => {

  test('basic logging example - font loading', async ({ page }) => {
    // Create a logger with custom configuration
    const logger = createTestLogger({
      testName: 'font-loading-test',
      enableBrowserLogs: true,
      enableNetworkLogs: true,
      filterPatterns: ['font', 'typeface'], // Only log font-related messages
      logLevels: ['error', 'warn', 'info']
    });

    // Attach logger to page - this will capture all browser console messages
    logger.attachToPage(page);

    logger.logInfo('Starting font loading test');

    // Navigate to page
    await page.goto('http://localhost:3010');
    
    logger.logInfo('Page loaded, checking for font files');

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');

    // Check for specific fonts
    const hasCustomFonts = await page.evaluate(() => {
      console.log('🔍 Checking custom fonts...');  // This will be captured by the logger
      
      const element = document.querySelector('h1');
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily;
        console.log('H1 font family:', fontFamily);  // This will be captured
        return fontFamily.includes('Funnel') || fontFamily.includes('GlacialIndifference');
      }
      return false;
    });

    logger.logInfo(`Custom fonts detected: ${hasCustomFonts}`);

    // Generate final report
    const reports = logger.finalize();
    
    // Log summary to console
    console.log('\n📊 Test Summary:');
    console.log(`- Browser logs captured: ${reports.browserLogs.length}`);
    console.log(`- E2E logs captured: ${reports.e2eLogs.length}`);
    
    expect(hasCustomFonts).toBe(true);
  });

  test('pull request feed with advanced logging', async ({ page }) => {
    // Use preset logger optimized for PR feed testing
    const logger = createPullRequestTestLogger();
    
    logger.attachToPage(page);
    logger.logInfo('Starting pull request feed test with enhanced logging');

    // Navigate to PR feed page
    await page.goto('http://localhost:3010/pull-request-feed', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    logger.logInfo('Page loaded, checking for PR feed component');

    // The logger will automatically capture:
    // - All console.log messages from the React app
    // - API calls to /api/github/pull-requests
    // - Any network timeouts or errors
    // - Component mount/unmount messages

    // Add some browser console logging for demonstration
    await page.evaluate(() => {
      console.log('🚀 Checking for pull request feed component...');
      console.info('Looking for data-testid="pull-request-feed"');
      
      const feedElement = document.querySelector('[data-testid="pull-request-feed"]');
      if (feedElement) {
        console.log('✅ Pull request feed component found');
      } else {
        console.warn('⚠️ Pull request feed component not found');
      }
    });

    // Check for component presence
    const feedExists = await page.locator('[data-testid="pull-request-feed"]').isVisible({ timeout: 10000 }).catch(() => false);
    
    if (feedExists) {
      logger.logInfo('Pull request feed component is visible');
      
      // Check for loading states
      await page.evaluate(() => {
        console.log('🔄 Checking loading states...');
        const loadingElements = document.querySelectorAll('[data-testid*="loading"]');
        console.log(`Found ${loadingElements.length} loading indicators`);
      });
      
    } else {
      logger.logWarn('Pull request feed component not found on page');
    }

    // Wait for any async operations
    await page.waitForTimeout(5000);

    // Generate comprehensive reports
    const reports = logger.finalize();
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 Pull Request Feed Test Report');
    console.log('='.repeat(50));
    console.log(reports.browserReport);
  });

  test('carousel interaction with detailed logging', async ({ page }) => {
    const logger = createTestLogger({
      testName: 'carousel-interaction',
      enableBrowserLogs: true,
      enableNetworkLogs: false, // Don't need network logs for carousel
      filterPatterns: ['carousel', 'splide', 'slide'], // Focus on carousel logs
    });

    logger.attachToPage(page);
    logger.logInfo('Starting carousel interaction test');

    await page.goto('http://localhost:3010');
    
    // Find a carousel on the page
    const carousels = page.locator('[id*="carousel"]');
    const carouselCount = await carousels.count();
    
    logger.logInfo(`Found ${carouselCount} carousels on page`);

    if (carouselCount > 0) {
      // Test first carousel
      const firstCarousel = carousels.first();
      const carouselId = await firstCarousel.getAttribute('id');
      
      logger.logInfo(`Testing carousel: ${carouselId}`);

      // Add browser console logging to track carousel state
      await page.evaluate((id) => {
        console.log(`🎠 Starting interaction with carousel: ${id}`);
        
        const carousel = document.getElementById(id);
        if (carousel) {
          const slides = carousel.querySelectorAll('.splide__slide');
          console.log(`Carousel has ${slides.length} slides`);
          
          // Check for active slide
          const activeSlide = carousel.querySelector('.is-active');
          if (activeSlide) {
            console.log('Found active slide:', activeSlide.textContent?.substring(0, 50));
          }
        }
      }, carouselId);

      // Try to click next button if it exists
      const nextButton = firstCarousel.locator('.splide__arrow--next');
      if (await nextButton.isVisible()) {
        logger.logInfo('Clicking next button');
        
        await page.evaluate(() => {
          console.log('🔄 About to click next button...');
        });
        
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        await page.evaluate(() => {
          console.log('✅ Next button clicked, checking new state...');
        });
      }
    }

    const reports = logger.finalize();
    console.log(`\n🎠 Carousel test completed with ${reports.browserLogs.length} browser messages logged`);
  });
}); 