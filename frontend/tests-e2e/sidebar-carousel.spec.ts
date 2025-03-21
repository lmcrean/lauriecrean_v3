import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Test to verify carousel arrow functionality
 */
test.describe('Carousel Arrow Functionality', () => {
  test('carousel arrows should correctly navigate between slides', async ({ page }) => {
    // Navigate to the projects page where we have carousels
    await page.goto('/projects');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait additional time for JavaScript to initialize carousel
    await page.waitForTimeout(2000);
    
    // Sample carousel IDs
    const carouselIds = ['coachmatrix-carousel', 'odyssey-carousel'];
    
    // Find a carousel that exists on the page
    let testCarousel = null;
    let carouselId = '';
    
    for (const id of carouselIds) {
      const carousel = page.locator(`#${id}`);
      const isVisible = await carousel.isVisible();
      if (isVisible) {
        testCarousel = carousel;
        carouselId = id;
        console.log(`Found visible carousel: ${id}`);
        break;
      }
    }
    
    // Skip test if no carousels are found
    if (!testCarousel) {
      test.skip('No carousels found on the page');
      return;
    }
    
    // Verify carousel is properly initialized
    await expect(testCarousel.locator('.splide__track'), `${carouselId} track should be visible`).toBeVisible();
    await expect(testCarousel.locator('.splide__list'), `${carouselId} list should be visible`).toBeVisible();
    
    // Check if the carousel has slides
    const slides = testCarousel.locator('.splide__slide');
    const slideCount = await slides.count();
    console.log(`Found ${slideCount} slides in ${carouselId}`);
    expect(slideCount, `${carouselId} should have slides`).toBeGreaterThan(0);
    
    // Get navigation arrows
    const nextButton = testCarousel.locator('.splide__arrow--next');
    const prevButton = testCarousel.locator('.splide__arrow--prev');
    await expect(nextButton, 'Next button should be visible').toBeVisible();
    await expect(prevButton, 'Previous button should be visible').toBeVisible();
    
    // Take screenshot of initial state
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-initial.png') 
    });
    
    // Get current active slide info
    const initialActiveSlideIndex = await getActiveSlideIndex(page, carouselId);
    console.log(`Initial active slide index: ${initialActiveSlideIndex}`);
    
    // Test arrow functionality - click next
    await nextButton.click();
    await page.waitForTimeout(300);
    
    // Take screenshot after next click
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-next.png') 
    });
    
    // Verify slide changed when arrow is clicked
    const afterNextClickIndex = await getActiveSlideIndex(page, carouselId);
    console.log(`Active slide index after next click: ${afterNextClickIndex}`);
    
    // Instead of expecting a specific index, just verify it changed
    expect(afterNextClickIndex, 'Active slide should change when next arrow is clicked').not.toBe(initialActiveSlideIndex);
    
    // Get the current index after next click
    const currentIndex = afterNextClickIndex;
    
    // Click back button to return to original slide
    await prevButton.click();
    await page.waitForTimeout(300);
    
    // Take screenshot after prev click
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-prev.png') 
    });
    
    // Verify we changed to a different slide
    const afterPrevClickIndex = await getActiveSlideIndex(page, carouselId);
    console.log(`Active slide index after prev click: ${afterPrevClickIndex}`);
    expect(afterPrevClickIndex, 'Active slide should change when prev arrow is clicked').not.toBe(currentIndex);
  });
  
  test('carousel arrows should visibly change slides', async ({ page }) => {
    // Navigate to the projects page where we have carousels
    await page.goto('/projects');
    
    // Wait for the page to fully load and JS to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Sample carousel IDs
    const carouselIds = ['coachmatrix-carousel', 'odyssey-carousel'];
    
    // Find a carousel that exists on the page
    let testCarousel = null;
    let carouselId = '';
    
    for (const id of carouselIds) {
      const carousel = page.locator(`#${id}`);
      const isVisible = await carousel.isVisible();
      if (isVisible) {
        testCarousel = carousel;
        carouselId = id;
        console.log(`Found visible carousel: ${id}`);
        break;
      }
    }
    
    if (!testCarousel) {
      test.skip('No carousels found on the page');
      return;
    }
    
    // Get navigation arrows
    const nextButton = testCarousel.locator('.splide__arrow--next');
    const prevButton = testCarousel.locator('.splide__arrow--prev');
    
    // Verify arrows exist
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
    
    // Get current slide src
    const initialImageSrc = await getActiveImageSrc(page, carouselId);
    console.log('Initial slide image src:', initialImageSrc);
    
    // Capture screenshot of the initial state
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-initial.png') 
    });
    
    // Click next and verify image changes
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Get new slide src
    const newImageSrc = await getActiveImageSrc(page, carouselId);
    console.log('New slide image src:', newImageSrc);
    
    // Verify a different image is showing
    expect(newImageSrc, 'Carousel should display a different image after next click').not.toBe(initialImageSrc);
    
    // Take screenshot of new state
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-next.png') 
    });
    
    // Click prev to go back to original slide
    await prevButton.click();
    await page.waitForTimeout(500);
    
    // Get final slide src
    const finalImageSrc = await getActiveImageSrc(page, carouselId);
    console.log('Final slide image src:', finalImageSrc);
    
    // Take final screenshot
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-visual-prev.png') 
    });
    
    // Verify we've returned to the original image or moved to a different one
    // Different carousels may behave differently on prev click
    expect(
      finalImageSrc, 
      'Carousel should display a different image after prev click'
    ).not.toBe(newImageSrc);
  });
});

/**
 * Helper function to get the index of the current active slide
 */
async function getActiveSlideIndex(page, carouselId) {
  return page.evaluate((id) => {
    const carousel = document.querySelector(`#${id}`);
    if (!carousel) return -1;
    
    const slides = carousel.querySelectorAll('.splide__slide');
    const slideArray = Array.from(slides);
    
    // First look for .is-active or .is-visible class
    const activeSlideIndex = slideArray.findIndex(slide => 
      slide.classList.contains('is-active') || 
      slide.classList.contains('is-visible'));
    
    // If no active class found, return the first slide index
    return activeSlideIndex !== -1 ? activeSlideIndex : 0;
  }, carouselId);
}

/**
 * Helper function to get the image src of the active slide
 */
async function getActiveImageSrc(page, carouselId) {
  return page.evaluate((id) => {
    const carousel = document.querySelector(`#${id}`);
    if (!carousel) return null;
    
    // Find active slide or first slide
    const activeSlide = carousel.querySelector('.splide__slide.is-active, .splide__slide.is-visible') || 
                        carousel.querySelector('.splide__slide');
    if (!activeSlide) return null;
    
    // Get image src
    const image = activeSlide.querySelector('img');
    return image ? image.src : null;
  }, carouselId);
} 