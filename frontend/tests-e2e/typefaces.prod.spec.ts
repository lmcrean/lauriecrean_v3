import { test, expect } from '@playwright/test';

/**
 * Production tests to verify typeface styling on the deployed site
 */
test.describe('Production Typeface Styling', () => {
  
  // Before each test, navigate to the home page
  test.beforeEach(async ({ page }) => {
    // baseURL is set in playwright.prod.config.ts to https://lauriecrean.dev
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit longer to ensure CSS has loaded
    await page.waitForTimeout(2000);
  });

  // Test that font resources are loaded
  test('should load font resources', async ({ page }) => {
    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests-e2e/screenshots/prod-typefaces-fonts.png' });
    
    // Check for resource requests in the network
    const fontRequests = await page.evaluate(() => {
      // Get all resources loaded by the page
      const resources = performance.getEntriesByType('resource');
      
      // Filter for font files
      const fontFiles = resources.filter(resource => {
        const url = resource.name.toLowerCase();
        return (
          url.includes('.ttf') || 
          url.includes('.otf') || 
          url.includes('.woff') ||
          url.includes('font')
        );
      }).map(resource => resource.name);
      
      return fontFiles;
    });
    
    console.log('Font resources loaded:', fontRequests);
    
    // Check if any font files were loaded
    expect(fontRequests.length).toBeGreaterThan(0);
  });

  // Test that the CSS styles are loaded
  test('should load CSS with font definitions', async ({ page }) => {
    // Check what CSS files are loaded
    const cssFiles = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(resource => resource.name.toLowerCase().includes('.css'))
        .map(resource => resource.name);
    });
    
    console.log('CSS files loaded in production:', cssFiles);
    
    // Check if any CSS files were loaded
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  // Test that elements exist on the page with expected styling
  test('should have properly styled headings and paragraphs', async ({ page }) => {
    // Check for h1 elements
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check for paragraph elements
    const pCount = await page.locator('p').count();
    expect(pCount).toBeGreaterThan(0);
    
    // Take a screenshot of the page to visually verify fonts
    await page.screenshot({ path: 'tests-e2e/screenshots/prod-typefaces-page.png', fullPage: true });
    
    // Test that h1 elements have styles applied
    if (h1Count > 0) {
      const h1HasStyle = await page.locator('h1').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          textAlign: style.textAlign
        };
      });
      
      console.log('H1 computed styles:', h1HasStyle);
      
      // Check that h1 has font styling (basic verification)
      expect(h1HasStyle.fontFamily).not.toBe('');
      expect(h1HasStyle.fontSize).not.toBe('');
    }
    
    // Test that paragraph elements have styles applied
    if (pCount > 0) {
      const pHasStyle = await page.locator('p').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight
        };
      });
      
      console.log('Paragraph computed styles:', pHasStyle);
      
      // Check that paragraph has font styling (basic verification)
      expect(pHasStyle.fontFamily).not.toBe('');
      expect(pHasStyle.fontSize).not.toBe('');
    }
  });
  
  // Visual comparison test - capture reference screenshot
  test('visual comparison of styled elements', async ({ page }) => {
    // Navigate to a specific page that has consistent content
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Locate heading elements
    const h1Element = page.locator('h1').first();
    if (await h1Element.count() > 0) {
      // Take screenshot of the h1 element for visual comparison
      await h1Element.screenshot({ path: 'tests-e2e/screenshots/prod-h1-element.png' });
      
      // We're intentionally not doing a visual comparison here
      // as this would require a baseline screenshot to compare against
      // Instead, this captures a reference screenshot we can use manually
    }
    
    // Locate paragraph elements
    const pElement = page.locator('p').first();
    if (await pElement.count() > 0) {
      // Take screenshot of the paragraph element for visual comparison
      await pElement.screenshot({ path: 'tests-e2e/screenshots/prod-p-element.png' });
    }
  });
}); 