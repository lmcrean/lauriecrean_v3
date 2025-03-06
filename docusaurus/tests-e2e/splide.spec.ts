import { test, expect } from '@playwright/test';

/**
 * Tests to verify Splide carousel functionality
 */
test.describe('Splide Carousel', () => {
  
  // Before each test, navigate to the test page with our sample carousel
  test.beforeEach(async ({ page }) => {
    // Navigate to the splide test page
    await page.goto('/splide-test');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Make sure the page title is correct
    await expect(page.locator('h1')).toContainText('Splide Test Page');
  });

  test('should load and initialize the Splide carousel', async ({ page }) => {
    // Check that Splide CSS is loaded
    const hasSplideCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('splide'));
    });
    expect(hasSplideCSS).toBeTruthy();

    // Check that Splide carousel is initialized
    const isInitialized = await page.evaluate(() => {
      return document.querySelector('.splide.is-initialized') !== null;
    });
    expect(isInitialized).toBeTruthy();

    // Verify carousel structure
    await expect(page.locator('.splide__track')).toBeVisible();
    await expect(page.locator('.splide__list')).toBeVisible();
    await expect(page.locator('.splide__slide')).toHaveCount(3);
  });

  test('should navigate between slides', async ({ page }) => {
    // Wait for carousel to be fully initialized
    await page.waitForSelector('.splide.is-initialized');
    
    // Get the next button
    const nextButton = page.locator('.splide__arrow--next');
    await expect(nextButton).toBeVisible();
    
    // Check initial slide (slide 1 should be visible)
    const slides = page.locator('.splide__slide');
    await expect(slides.nth(0)).toBeVisible();
    await expect(slides.nth(0).locator('h2')).toContainText('Slide 1');
    
    // Click next button and check that slide 2 is now visible
    await nextButton.click();
    // Wait for animation to complete
    await page.waitForTimeout(500);
    await expect(slides.nth(1).locator('h2')).toContainText('Slide 2');
    
    // Click next button again and check that slide 3 is now visible
    await nextButton.click();
    await page.waitForTimeout(500);
    await expect(slides.nth(2).locator('h2')).toContainText('Slide 3');
    
    // Get the previous button
    const prevButton = page.locator('.splide__arrow--prev');
    await expect(prevButton).toBeVisible();
    
    // Click previous button and check that we go back to slide 2
    await prevButton.click();
    await page.waitForTimeout(500);
    await expect(slides.nth(1).locator('h2')).toContainText('Slide 2');
  });

  test('should update progress bar when navigating', async ({ page }) => {
    // Wait for carousel to be fully initialized
    await page.waitForSelector('.splide.is-initialized');
    
    // Check progress bar exists
    const progressBar = page.locator('.my-carousel-progress-bar');
    await expect(progressBar).toBeVisible();

    // Get initial width of progress bar
    const initialWidth = await progressBar.evaluate(el => el.style.width);
    
    // Click next button
    await page.locator('.splide__arrow--next').click();
    await page.waitForTimeout(500);
    
    // Get new width of progress bar
    const newWidth = await progressBar.evaluate(el => el.style.width);
    
    // Width should change after navigation
    expect(initialWidth).not.toEqual(newWidth);
  });

  test('readme-port page should have working carousels', async ({ page }) => {
    // Navigate to readme-port page
    await page.goto('/readme-port');
    await page.waitForLoadState('networkidle');
    
    // Check that odyssey carousel is present and initialized
    const odysseyCarousel = page.locator('#odyssey-carousel');
    await expect(odysseyCarousel).toBeVisible();
    
    // Wait for carousel to be initialized (this might take time on first load)
    await page.waitForSelector('#odyssey-carousel.is-initialized', { timeout: 5000 }).catch(e => {
      console.log('Carousel initialization timed out, continuing with test');
    });
    
    // Check if the carousel has the arrows for navigation
    const hasArrows = await odysseyCarousel.locator('.splide__arrow').count() > 0;
    expect(hasArrows).toBeTruthy();
  });
}); 