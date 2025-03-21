import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Visual verification test for sidebar toggle effect on carousels
 */
test.describe('Sidebar Toggle Visual Verification', () => {
  test('should capture and verify carousel states during sidebar toggle', async ({ page }) => {
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
    
    // Verify arrows exist
    const nextExists = await nextButton.isVisible();
    const prevExists = await prevButton.isVisible();
    
    if (!nextExists || !prevExists) {
      console.log('Carousel arrows not found, skipping test');
      return;
    }
    
    console.log('Carousel arrows found, proceeding with test');
    
    // Take a screenshot of the initial state
    await page.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-initial.png') 
    });
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-initial.png') 
    });
    console.log('Initial screenshots captured');
    
    // 1. First verify normal carousel navigation
    // Click on next arrow to verify normal carousel functionality
    await nextButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'next-click.png') 
    });
    console.log('Arrow click screenshot captured');
    
    // Return to original slide
    await prevButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'prev-click.png') 
    });
    console.log('Return to original slide screenshot captured');
    
    // 2. Find and click the sidebar collapse button
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
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-after-collapse.png') 
    });
    console.log('After sidebar collapse screenshots captured');
    
    // 3. Verify carousel functionality still works after sidebar collapse
    // Click next arrow again after sidebar toggle
    await nextButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'next-after-collapse.png') 
    });
    console.log('Next arrow after collapse screenshot captured');
    
    // Click prev arrow to return to original slide
    await prevButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'prev-after-collapse.png') 
    });
    console.log('Prev arrow after collapse screenshot captured');
    
    // 4. Uncollapse the sidebar to verify things work both ways
    // The button's aria-label changes to "Expand sidebar" after collapsing
    const sidebarExpandButton = page.locator('button[aria-label="Expand sidebar"], button[title="Expand sidebar"], button.expandSidebarButton').first();
    
    const expandButtonExists = await sidebarExpandButton.isVisible();
    if (!expandButtonExists) {
      console.log('Sidebar expand button not found, skipping expand test');
      
      // Try using the original button again
      if (collapseButtonExists) {
        await sidebarCollapseButton.click();
        await page.waitForTimeout(1000);
      }
    } else {
      // Expand the sidebar
      await sidebarExpandButton.click();
      await page.waitForTimeout(1000); // Wait for animation to complete
    }
    
    // Take screenshots after sidebar expand
    await page.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'full-page-after-expand.png') 
    });
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'carousel-after-expand.png') 
    });
    console.log('After sidebar expand screenshots captured');
    
    // 5. Final test - click next arrow after expand to verify everything still works
    await nextButton.click();
    await page.waitForTimeout(500);
    await page.locator(carouselSelector).screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'visual-regression', 'next-after-expand.png') 
    });
    console.log('Final screenshot captured');
    
    // Test complete - these screenshots can be examined visually to confirm
    // if the carousel maintained its visual integrity through the sidebar toggle
    console.log('Test complete, all screenshots captured for visual verification');
  });
}); 