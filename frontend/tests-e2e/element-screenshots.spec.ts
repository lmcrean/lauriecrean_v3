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
    path: path.join('tests-e2e', 'screenshots', 'elements', 'prod-sidebar-element.png'),
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: Math.min(boundingBox.height, 600) // Limit height to 600px
    }
  });

  // Capture right sidebar (table of contents)
  await page.locator('.table-of-contents').screenshot({
    path: path.join('tests-e2e', 'screenshots', 'elements', 'prod-toc-element.png')
  });

  // Capture h1 element
  await page.locator('h1').first().screenshot({
    path: path.join('tests-e2e', 'screenshots', 'elements', 'prod-h1-element.png')
  });

  // Capture first paragraph
  await page.locator('p').first().screenshot({
    path: path.join('tests-e2e', 'screenshots', 'elements', 'prod-p-element.png')
  });
});

// Capture the Odyssey project section with minimum height of 700px
test('capture project screenshot element', async ({ page }) => {
  // Navigate to the projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');
  
  // Look for the Odyssey project section
  const odysseyHeading = await page.waitForSelector('h2:has-text("Odyssey")', { timeout: 60000 });
  
  // Scroll the Odyssey heading to the top of the viewport
  await odysseyHeading.scrollIntoViewIfNeeded();
  
  // Additional scroll to position heading exactly at the top
  const headingBox = await odysseyHeading.boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), headingBox.y);
  
  // Verify position after manual scroll
  const finalHeadingBox = await odysseyHeading.boundingBox();
  
  // Small pause to ensure scrolling is complete
  await page.waitForTimeout(500);
  
  // Find the container of the Odyssey project
  const odysseySection = await page.$('h2:has-text("Odyssey")').then(h2 => 
    h2.evaluateHandle(node => {
      // Find the closest div with the screenshot-project-element class
      let current = node;
      while (current && current.parentElement) {
        if (current.classList && current.classList.contains('screenshot-project-element')) {
          return current;
        }
        // If we can't find the specific class, go up to the parent div
        if (current.tagName === 'DIV') {
          return current;
        }
        current = current.parentElement;
      }
      return node.closest('div');
    })
  );
  
  const boundingBox = await odysseySection.boundingBox();
  
  // Calculate height to capture (from heading to end of section or 700px, whichever is greater)
  const captureHeight = 1400;

  // Take screenshot starting from the heading position
  await page.screenshot({
    path: path.join('tests-e2e', 'screenshots', 'elements', 'project-screenshot-element.png'),
    clip: {
      x: boundingBox.x,
      y: finalHeadingBox.y, // Start exactly at the heading position
      width: boundingBox.width,
      height: captureHeight // Ensure at least 700px height from the heading
    }
  });
});

// Capture the navbar with icons
test('capture navbar screenshot element', async ({ page }) => {
  // Navigate to the projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');
  
  // Wait for navbar to be visible
  const navbar = await page.waitForSelector('.navbar', { timeout: 60000 });
  
  // Ensure the navbar is fully visible
  await navbar.scrollIntoViewIfNeeded();
  
  // Small pause to ensure any animations are complete
  await page.waitForTimeout(500);
  
  // Get the bounding box of the navbar
  const boundingBox = await navbar.boundingBox();
  
  // Take screenshot of the navbar
  await page.screenshot({
    path: path.join('tests-e2e', 'screenshots', 'elements', 'navbar-element.png'),
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height
    }
  });
}); 