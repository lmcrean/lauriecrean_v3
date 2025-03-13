import { test, expect } from '@playwright/test';
import path from 'path';

test('capture Odyssey project screenshot', async ({ page }) => {
  // Navigate to the projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot first
  await page.screenshot({
    path: path.join('tests-e2e', 'screenshots', 'projects-full-page.png'),
    fullPage: true
  });
  
  // Look for the Odyssey heading
  const odysseyHeading = page.getByRole('heading', { name: /Odyssey/i }).first();
  
  // Wait for it to be visible and scroll to it
  await odysseyHeading.waitFor({ state: 'visible' });
  await odysseyHeading.scrollIntoViewIfNeeded();
  
  // Get the parent element that contains the entire project
  // This is a more flexible approach that tries to find the container
  const projectSection = page.locator('article, section, .main-content > div').filter({ 
    has: odysseyHeading 
  }).first();
  
  // Take the screenshot
  if (await projectSection.count() > 0) {
    await projectSection.screenshot({
      path: path.join('tests-e2e', 'screenshots', 'odyssey-project.png')
    });
  } else {
    // Fallback: Take a screenshot of a reasonable area around the heading
    const box = await odysseyHeading.boundingBox();
    await page.screenshot({
      path: path.join('tests-e2e', 'screenshots', 'odyssey-project.png'),
      clip: {
        x: box.x,
        y: box.y,
        width: page.viewportSize().width * 0.8,
        height: 800 // Capture a good amount below the heading
      }
    });
  }
}); 