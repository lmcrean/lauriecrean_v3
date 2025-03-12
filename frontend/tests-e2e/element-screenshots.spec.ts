import { test, expect } from '@playwright/test';
import path from 'path';

test('capture element screenshots', async ({ page }) => {
  // Navigate to the projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');

  // Wait for key elements to be visible
  await page.waitForSelector('.theme-doc-sidebar-container');
  await page.waitForSelector('.table-of-contents');
  await page.waitForSelector('h1');

  // Capture main left sidebar with height limit
  const sidebarElement = await page.locator('.theme-doc-sidebar-container');
  const boundingBox = await sidebarElement.boundingBox();
  
  // Take a screenshot of the viewport around the sidebar
  await page.screenshot({
    path: path.join('tests-e2e', 'screenshots', 'prod-sidebar-element.png'),
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: Math.min(boundingBox.height, 600) // Limit height to 600px
    }
  });

  // Capture right sidebar (table of contents)
  await page.locator('.table-of-contents').screenshot({
    path: path.join('tests-e2e', 'screenshots', 'prod-toc-element.png')
  });

  // Capture h1 element
  await page.locator('h1').first().screenshot({
    path: path.join('tests-e2e', 'screenshots', 'prod-h1-element.png')
  });

  // Capture first paragraph
  await page.locator('p').first().screenshot({
    path: path.join('tests-e2e', 'screenshots', 'prod-p-element.png')
  });
}); 