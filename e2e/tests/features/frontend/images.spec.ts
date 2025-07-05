import { test, expect } from '@playwright/test';

test.describe('Image Loading Tests', () => {
  test('all images on the projects page should load correctly', async ({ page }) => {
    // Navigate to the production URL - we'll override baseUrl from command line when running in production
    await page.goto('/projects');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get all image elements
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images on the page`);
    
    // Track any failed images for reporting
    const failedImages = [];
    
    // Check each image
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt') || 'No alt text';
      
      if (!src) {
        failedImages.push(`Image with alt "${alt}" has no src attribute`);
        continue;
      }
      
      // Skip GitHub shields badges as they are external resources
      if (src.includes('img.shields.io')) {
        console.log(`Skipping GitHub shield badge: ${src}`);
        continue;
      }
      
      // Check if the image is visible
      const isVisible = await img.isVisible();
      if (!isVisible) {
        failedImages.push(`Image with src "${src}" and alt "${alt}" is not visible`);
        continue;
      }
      
      // Check natural width to see if the image loaded
      // If an image fails to load, its naturalWidth is usually 0
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      if (naturalWidth === 0) {
        failedImages.push(`Image failed to load: ${src} (alt: ${alt})`);
      }
    }
    
    // If any images failed to load, fail the test with details
    if (failedImages.length > 0) {
      console.error('Failed images:');
      failedImages.forEach(failedImg => console.error(failedImg));
      expect(failedImages.length, 
        `${failedImages.length} images failed to load:\n${failedImages.join('\n')}`
      ).toBe(0);
    }
  });
  
  // Test specific key images that should always be present
  test('key project images should load correctly', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    // List of important images to test specifically
    const keyImages = [
      { selector: 'img[alt="banner"]', description: 'Banner image' },
      { selector: '#odyssey-carousel img', description: 'Odyssey carousel image' },
      { selector: '#coachmatrix-carousel img', description: 'Coach Matrix carousel image' },
      { selector: '#steamreport-carousel img', description: 'Steam Report carousel image' }
    ];
    
    for (const { selector, description } of keyImages) {
      const img = page.locator(selector).first();
      await expect(img, `${description} should be visible`).toBeVisible();
      
      const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth, `${description} should have loaded properly`).toBeGreaterThan(0);
    }
  });
}); 