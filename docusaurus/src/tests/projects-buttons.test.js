/**
 * Test to verify button classes from buttons.css are included in the build files for the projects page
 */

const fs = require('fs');
const path = require('path');

describe('Projects Page Button Integration', () => {
  let htmlContent;
  let cssContent;
  
  // Check if build directory exists before running tests
  beforeAll(() => {
    const buildDir = path.resolve(__dirname, '../../build');
    const cssPath = path.resolve(__dirname, '../css/buttons.css');
    
    if (fs.existsSync(buildDir)) {
      // Find the projects page HTML in the build directory
      const projectsHtmlPath = findProjectsHtmlFile(buildDir);
      
      if (projectsHtmlPath) {
        htmlContent = fs.readFileSync(projectsHtmlPath, 'utf8');
      } else {
        console.warn('Projects HTML file not found in build directory');
      }
      
      // Read the buttons.css file for reference
      if (fs.existsSync(cssPath)) {
        cssContent = fs.readFileSync(cssPath, 'utf8');
      } else {
        console.warn('buttons.css file not found');
      }
    } else {
      console.warn('Build directory not found. Run "npm run build" first.');
    }
  });
  
  // Helper function to find the projects HTML file in the build directory
  function findProjectsHtmlFile(buildDir) {
    // First try direct path
    const directPath = path.join(buildDir, 'projects', 'index.html');
    if (fs.existsSync(directPath)) {
      return directPath;
    }
    
    // Search recursively if not found
    let result = null;
    
    function searchDir(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          searchDir(itemPath);
        } else if (item === 'index.html') {
          // Check if this HTML file contains project content
          const content = fs.readFileSync(itemPath, 'utf8');
          if (content.includes('Projects') && 
              (content.includes('code-btn') || 
               content.includes('readme-btn') || 
               content.includes('live-demo-btn'))) {
            result = itemPath;
            return;
          }
        }
      }
    }
    
    try {
      searchDir(buildDir);
    } catch (error) {
      console.error('Error searching for projects HTML:', error);
    }
    
    return result;
  }
  
  // Skip all tests if build files aren't available
  const conditionalTest = htmlContent ? test : test.skip;
  
  conditionalTest('HTML includes button elements with correct classes', () => {
    expect(htmlContent).toBeDefined();
    
    // Check for button elements with the correct classes
    expect(htmlContent).toMatch(/<button class="code-btn"/);
    expect(htmlContent).toMatch(/<button class="readme-btn"/);
    expect(htmlContent).toMatch(/<button class="live-demo-btn"/);
  });
  
  conditionalTest('CSS for buttons is included in the page', () => {
    expect(htmlContent).toBeDefined();
    
    // Check that the CSS for the buttons is included in some way
    // This could be inline CSS or a link to a stylesheet
    const hasButtonCssClasses = 
      htmlContent.includes('.code-btn') ||
      htmlContent.includes('.readme-btn') ||
      htmlContent.includes('.live-demo-btn');
      
    expect(hasButtonCssClasses).toBe(true);
  });
  
  conditionalTest('Icon elements are present in buttons', () => {
    expect(htmlContent).toBeDefined();
    
    // Check for icon elements within buttons
    expect(htmlContent).toMatch(/<i class="fa fa-code"/);
    expect(htmlContent).toMatch(/<i class="fa fa-book"/);
    expect(htmlContent).toMatch(/<i class="fa fa-play"/);
  });
}); 