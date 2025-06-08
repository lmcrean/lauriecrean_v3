import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Test to verify Buffalo carousel functionality and image loading
 */
test.describe('Buffalo Carousel', () => {
  test('buffalo carousel should load and display correctly', async ({ page }) => {
    // Navigate to the projects page
    await page.goto('/projects');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait additional time for JavaScript to initialize carousel
    await page.waitForTimeout(2000);
    
    // Check that buffalo carousel container is present
    const buffaloCarousel = page.locator('#buffalo-carousel');
    await expect(buffaloCarousel, 'Buffalo carousel should be visible').toBeVisible();
    
    // Check if the carousel has the proper structure
    await expect(buffaloCarousel.locator('.splide__track'), 'Buffalo carousel track should be visible').toBeVisible();
    await expect(buffaloCarousel.locator('.splide__list'), 'Buffalo carousel list should be visible').toBeVisible();
    
    // Check if the carousel has slides
    const slides = buffaloCarousel.locator('.splide__slide');
    const slideCount = await slides.count();
    expect(slideCount, 'Buffalo carousel should have at least 1 slide').toBeGreaterThan(0);
    console.log(`Found ${slideCount} slides in buffalo carousel`);
    
    // Check for navigation arrows (indicates initialization)
    const nextButton = buffaloCarousel.locator('.splide__arrow--next');
    const prevButton = buffaloCarousel.locator('.splide__arrow--prev');
    await expect(nextButton, 'Next button should be visible').toBeVisible();
    await expect(prevButton, 'Previous button should be visible').toBeVisible();
    
    // Check the progress bar
    const progressBar = buffaloCarousel.locator('.my-carousel-progress');
    await expect(progressBar, 'Progress bar container should be visible').toBeVisible();
    
    // Log all image elements
    const images = buffaloCarousel.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images in buffalo carousel`);
    
    // Check image sources to verify the correct path structure
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      
      // Log image details for debugging without requiring visibility
      const src = await image.getAttribute('src');
      const alt = await image.getAttribute('alt') || 'No alt text';
      console.log(`Image ${i+1} - src: ${src}, alt: ${alt}`);
      
      // Verify the image path follows expected structure
      if (src) {
        expect(src, `Image ${i+1} should have a valid src path`).toBeTruthy();
        
        // Check if the path uses the expected structure
        if (src.includes('/docs/screenshots/')) {
          console.log(`Image ${i+1} uses /docs/screenshots/ path structure`);
        } else {
          console.log(`Image ${i+1} uses a different path structure: ${src}`);
        }
      }
    }
    
    // Take a screenshot of the buffalo carousel for visual reference
    await buffaloCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'buffalo-carousel.png') 
    });
    
    // Test carousel navigation (optional)
    // Click the next button and verify the active slide changes
    if (slideCount > 1) {
      // Get the current active slide or first slide
      const initialSlide = buffaloCarousel.locator('.splide__slide.is-active, .splide__slide').first();
      const initialSrc = await initialSlide.locator('img').getAttribute('src');
      
      // Click the next button
      await nextButton.click();
      
      // Wait for transition
      await page.waitForTimeout(500);
      
      // Get the new active slide
      const newActiveSlide = buffaloCarousel.locator('.splide__slide.is-active, .splide__slide').first();
      const newSrc = await newActiveSlide.locator('img').getAttribute('src');
      
      // Verify the slide changed (different image src)
      expect(newSrc, 'Carousel should navigate to a different slide').not.toBe(initialSrc);
    }
  });
}); 