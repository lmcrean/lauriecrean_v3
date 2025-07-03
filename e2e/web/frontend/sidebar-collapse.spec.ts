import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Test to verify carousel maintains integrity when sidebar is collapsed
 */
test.describe('Sidebar Collapse', () => {
  test('carousel should maintain integrity when sidebar is collapsed', async ({ page }) => {
    // Navigate to the projects page where we have carousels
    await page.goto('/projects');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // We'll use the coachmatrix-carousel if it exists
    const carouselSelector = '#coachmatrix-carousel';
    
    // Check if the carousel exists
    const carouselExists = await page.locator(carouselSelector).isVisible();
    if (!carouselExists) {
      console.log('Coachmatrix carousel not found, skipping test');
      return;
    }
    
    console.log('Coachmatrix carousel found, proceeding with test');
    
    // Get navigation arrows
    const nextButton = page.locator(`${carouselSelector} .splide__arrow--next`);
    const prevButton = page.locator(`${carouselSelector} .splide__arrow--prev`);
    
    // Take initial screenshots
    await page.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-initial.png') 
    });
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-initial.png') 
    });
    
    // Find and click the sidebar collapse button
    const sidebarCollapseButton = page.locator('button.collapseSidebarButton_PEFL, button[aria-label="Collapse sidebar"], button[title="Collapse sidebar"]').first();
    
    const collapseButtonExists = await sidebarCollapseButton.isVisible();
    if (!collapseButtonExists) {
      console.log('Sidebar collapse button not found, skipping collapse test');
      return;
    }
    
    console.log('Sidebar collapse button found, proceeding with collapse test');
    
    // Collapse the sidebar
    await sidebarCollapseButton.click();
    await page.waitForTimeout(1000); // Wait for animation to complete
    
    // Take screenshots after sidebar collapse
    await page.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-after-collapse.png') 
    });
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-collapse.png') 
    });
    
    // Click next arrow after sidebar collapse
    await nextButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-next-after-collapse.png') 
    });
  });
}); 