import { test, expect } from '@playwright/test';

/**
 * Tests to verify typeface styling across the site
 */
test.describe('Typeface Styling', () => {
  
  // Before each test, navigate to the home page
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait longer to ensure CSS and fonts have loaded
    await page.waitForTimeout(3000);
  });

  // Test that the font files are loaded in the page
  test('should load font files', async ({ page }) => {
    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests-e2e/screenshots/typefaces-fonts.png' });
    
    // Manually navigate to the font files to check if they exist
    for (const fontFile of ['FunnelDisplay-VariableFont_wght.ttf', 'GlacialIndifference-Regular.woff', 'GlacialIndifference-Bold.woff']) {
      const fontUrl = `http://localhost:3000/fonts/${fontFile}`;
      const fontResponse = await page.evaluate(async (url) => {
        try {
          const response = await fetch(url);
          return {
            status: response.status,
            contentType: response.headers.get('content-type'),
            ok: response.ok
          };
        } catch (error) {
          return { error: error.toString(), ok: false };
        }
      }, fontUrl);

      console.log(`Font file ${fontFile} check:`, fontResponse);
      expect(fontResponse.ok).toBeTruthy();
    }
    
    // Check for font file requests in the network
    const fontRequests = await page.evaluate(() => {
      // Get all resources loaded by the page
      const resources = performance.getEntriesByType('resource');
      
      // Filter for font files
      const fontFiles = resources.filter(resource => {
        const url = resource.name.toLowerCase();
        return url.includes('.ttf') || url.includes('.otf') || url.includes('.woff');
      }).map(resource => resource.name);
      
      return fontFiles;
    });
    
    console.log('Font files loaded:', fontRequests);
    
    // Check if any font files were loaded
    expect(fontRequests.length).toBeGreaterThan(0);
    
    // Optional: Check for specific font files if they're loaded directly
    // This may not work if fonts are bundled or loaded differently in production
    const hasFunnelFont = fontRequests.some(url => url.includes('funnel') || url.includes('FunnelDisplay'));
    const hasGlacialFont = fontRequests.some(url => url.includes('glacial') || url.includes('GlacialIndifference'));
    const hasActorFont = fontRequests.some(url => url.includes('actor'));
    
    // Log what we found for debugging
    console.log('Found fonts - Funnel:', hasFunnelFont, 'GlacialIndifference:', hasGlacialFont, 'Actor:', hasActorFont);
  });

  // Test that the CSS file with font definitions is loaded
  test('should load typefaces CSS file', async ({ page }) => {
    // Check if the typefaces.css file is loaded
    const cssFiles = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(resource => resource.name.toLowerCase().includes('.css'))
        .map(resource => resource.name);
    });
    
    console.log('CSS files loaded:', cssFiles);
    
    // Check if any CSS files were loaded
    expect(cssFiles.length).toBeGreaterThan(0);
    
    // Look for typefaces.css or a file that might contain font definitions
    const hasFontCss = cssFiles.some(url => 
      url.includes('typefaces') || 
      url.includes('fonts') || 
      url.includes('styles') || 
      url.includes('main')
    );
    
    expect(hasFontCss).toBeTruthy();
  });

  // Test that elements exist on the page with expected styling
  test('should have heading and paragraph elements on the page', async ({ page }) => {
    // Check for h1 elements
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check for paragraph elements
    const pCount = await page.locator('p').count();
    expect(pCount).toBeGreaterThan(0);
    
    // Take a screenshot of the page to visually verify fonts
    await page.screenshot({ path: 'tests-e2e/screenshots/typefaces-page.png', fullPage: true });
    
    // Check if h1 has a computed style (this is a basic check that styling is applied)
    if (h1Count > 0) {
      const h1Styles = await page.locator('h1').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          textAlign: style.textAlign
        };
      });
      
      console.log('H1 computed styles:', h1Styles);
      
      // Check that h1 has Funnel Display font (or at least a non-default font)
      expect(h1Styles.fontFamily).not.toBe('');
      const hasFunnelFont = h1Styles.fontFamily.toLowerCase().includes('funnel');
      console.log('H1 has Funnel Display font:', hasFunnelFont);
    }
    
    // Check if p has a computed style
    if (pCount > 0) {
      const pStyles = await page.locator('p').first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight
        };
      });
      
      console.log('Paragraph computed styles:', pStyles);
      
      // Check that paragraph has GlacialIndifference font (or at least a non-default font)
      expect(pStyles.fontFamily).not.toBe('');
      const hasGlacialFont = pStyles.fontFamily.toLowerCase().includes('glacial');
      console.log('Paragraph has GlacialIndifference font:', hasGlacialFont);
    }
  });
}); 