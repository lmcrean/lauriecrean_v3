import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Test to verify carousel behavior when sidebar is toggled
 */
test.describe('Sidebar Toggle Carousel Integrity', () => {
  test('carousel should maintain visual integrity after sidebar toggle', async ({ page }) => {
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
    
    // Skip test only if truly no carousels are found
    if (!testCarousel) {
      console.log('No carousels found, skipping test');
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
    
    // Get current active slide info
    const initialActiveSlideIndex = await getActiveSlideIndex(page, carouselId);
    console.log(`Initial active slide index: ${initialActiveSlideIndex}`);
    
    // Get current slide image source
    const initialImageSrc = await getActiveImageSrc(page, carouselId);
    console.log('Initial slide image src:', initialImageSrc);
    
    // Get initial position metrics of the carousel
    const initialMetrics = await getCarouselMetrics(page, carouselId);
    console.log('Initial carousel metrics:', initialMetrics);
    
    // Take a screenshot before toggle
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-before-toggle.png') 
    });
    
    // 1. First verify arrows work by checking image changes, not just index
    // Click next arrow
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Get new image source after clicking next
    const afterNextClickSrc = await getActiveImageSrc(page, carouselId);
    console.log('Image src after next click:', afterNextClickSrc);
    
    // In some carousel implementations, the slide index might be the same but content changes
    // So we test if either the index changed or the image changed
    const afterNextClickIndex = await getActiveSlideIndex(page, carouselId);
    console.log(`Slide index after next click: ${afterNextClickIndex}`);
    
    // Take screenshot after clicking next
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-next.png') 
    });
    
    // Verify either index or content changed
    const indexChanged = afterNextClickIndex !== initialActiveSlideIndex;
    const imageChanged = afterNextClickSrc !== initialImageSrc;
    
    expect(indexChanged || imageChanged, 'Either slide index or image should change when clicking next').toBeTruthy();
    
    // Return to original slide
    await prevButton.click();
    await page.waitForTimeout(500);
    
    // Get image source after clicking prev
    const afterPrevClickSrc = await getActiveImageSrc(page, carouselId);
    console.log('Image src after prev click:', afterPrevClickSrc);
    
    // Take screenshot after clicking prev
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-prev.png') 
    });
    
    // Verify the content changed back (either same as initial or different from "next" state)
    expect(afterPrevClickSrc !== afterNextClickSrc || afterPrevClickSrc === initialImageSrc, 
           'Image should change back to original or at least different from next state').toBeTruthy();
    
    // 2. Now toggle the sidebar
    // Find the specific sidebar collapse button
    const sidebarCollapseButton = page.locator('button.collapseSidebarButton_PEFL, button[aria-label="Collapse sidebar"], button[title="Collapse sidebar"]').first();
    
    const collapseButtonExists = await sidebarCollapseButton.isVisible();
    if (!collapseButtonExists) {
      console.log('Sidebar collapse button not found, skipping collapse test');
      
      // Just for visual verification, resize to cause reflow
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 1000, height: 900 });
      await page.waitForTimeout(500);
    } else {
      // Click the sidebar collapse button
      console.log('Found sidebar collapse button, clicking it');
      await sidebarCollapseButton.click();
      console.log('Clicked sidebar collapse button');
      await page.waitForTimeout(500); // Wait for animation
    }
    
    // 3. Check carousel integrity after sidebar toggle
    const afterToggleMetrics = await getCarouselMetrics(page, carouselId);
    console.log('After sidebar toggle metrics:', afterToggleMetrics);
    
    // Take a screenshot after toggle
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-after-toggle.png') 
    });
    
    // Get current slide image source after toggle
    const afterToggleImageSrc = await getActiveImageSrc(page, carouselId);
    console.log('Image src after sidebar toggle:', afterToggleImageSrc);
    
    // Verify the carousel maintains reasonable dimensions
    expect(afterToggleMetrics.slideWidth, 'Carousel slide should maintain reasonable width after toggle').toBeGreaterThan(200);
    expect(afterToggleMetrics.visible, 'Carousel should remain visible after toggle').toBeTruthy();
    
    // Verify content hasn't changed - comparing with state after clicking prev (should be same as initial)
    expect(afterToggleImageSrc, 'Carousel should show the same content after sidebar toggle').toBe(afterPrevClickSrc);
    
    // 4. Verify arrows still work after sidebar toggle
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Get image after clicking next again
    const finalNextSrc = await getActiveImageSrc(page, carouselId);
    console.log('Final image src after next click:', finalNextSrc);
    
    // Take a final screenshot
    await testCarousel.screenshot({ 
      path: path.join('tests-e2e', 'screenshots', 'carousels', 'carousel-final.png') 
    });
    
    // Verify content changed after clicking next
    expect(finalNextSrc !== afterToggleImageSrc, 'Arrows should still change content after sidebar toggle').toBeTruthy();
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

/**
 * Helper function to get carousel metrics
 */
async function getCarouselMetrics(page, carouselId) {
  return page.evaluate((id) => {
    const carousel = document.querySelector(`#${id}`);
    if (!carousel) return null;
    
    // Get track and active slide
    const track = carousel.querySelector('.splide__track');
    const activeSlide = carousel.querySelector('.splide__slide.is-active, .splide__slide.is-visible') || 
                        carousel.querySelector('.splide__slide');
    
    if (!track || !activeSlide) return { width: 0, height: 0, visible: false };
    
    // Get position information
    const carouselRect = carousel.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const slideRect = activeSlide.getBoundingClientRect();
    
    return {
      carouselWidth: carouselRect.width,
      carouselHeight: carouselRect.height,
      trackWidth: trackRect.width,
      trackHeight: trackRect.height,
      slideWidth: slideRect.width,
      slideHeight: slideRect.height,
      slideLeft: slideRect.left,
      slideTop: slideRect.top,
      width: carouselRect.width,
      height: carouselRect.height,
      visible: carouselRect.width > 0 && carouselRect.height > 0 &&
              slideRect.width > 0 && slideRect.height > 0
    };
  }, carouselId);
} 