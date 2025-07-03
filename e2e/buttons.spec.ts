import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Tests to verify button styling in projects.md
 */
test.describe('Button Styling', () => {
  
  // Before each test, navigate to the projects page
  test.beforeEach(async ({ page }) => {
    // Navigate to the projects page - using the full URL pattern
    await page.goto('http://localhost:3010/projects');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit longer to ensure CSS has loaded
    await page.waitForTimeout(1000);
  });

  test('should have buttons with styling applied', async ({ page }) => {
    // Wait for buttons to be visible
    await page.waitForSelector('button, .button, [role="button"]');
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: path.join('screenshots', 'components', 'buttons-page.png') 
    });
    
    // Find all button types
    const codeButtons = page.locator('button.code-btn');
    const readmeButtons = page.locator('button.readme-btn');
    const liveDemoButtons = page.locator('button.live-demo-btn');
    
    // Verify buttons exist
    const codeCount = await codeButtons.count();
    const readmeCount = await readmeButtons.count();
    const liveCount = await liveDemoButtons.count();
    
    console.log(`Found ${codeCount} code buttons, ${readmeCount} readme buttons, ${liveCount} live demo buttons`);
    
    // Only verify at least one of each exists
    expect(codeCount).toBeGreaterThan(0);
    expect(readmeCount).toBeGreaterThan(0);
    expect(liveCount).toBeGreaterThan(0);
    
    // Grab first button of each type
    const codeButton = codeButtons.first();
    const readmeButton = readmeButtons.first();
    const liveDemoButton = liveDemoButtons.first();
    
    // Verify they are visible
    await expect(codeButton).toBeVisible();
    await expect(readmeButton).toBeVisible();
    await expect(liveDemoButton).toBeVisible();
    
    // Check for basic styling
    const codeStyles = await codeButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        padding: styles.padding
      };
    });
    
    console.log('Code button styles:', codeStyles);
    
    // Very basic style checks (just make sure something is applied)
    expect(codeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(codeStyles.backgroundColor).not.toBe('transparent');
    expect(codeStyles.color).not.toBe('');
    
    // Check for icon presence
    const hasIcons = await page.locator('button i').count();
    console.log(`Found ${hasIcons} button icons`);
    expect(hasIcons).toBeGreaterThan(0);
  });
}); 