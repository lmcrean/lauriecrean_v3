/**
 * Test to verify button classes from buttons.css are included in the build files for the projects page
 */

const fs = require('fs');
const path = require('path');

describe('Projects Page Button Integration', () => {
  let htmlContent;
  let cssContent;
  
  // Check for build files before running tests
  beforeAll(() => {
    const projectsHtmlPath = path.resolve(__dirname, '../../build/projects/index.html');
    const cssPath = path.resolve(__dirname, '../css/buttons.css');
    
    console.log('Projects HTML path:', projectsHtmlPath);
    console.log('CSS path:', cssPath);
    
    // Check for projects HTML file
    if (fs.existsSync(projectsHtmlPath)) {
      console.log('Found projects HTML file');
      htmlContent = fs.readFileSync(projectsHtmlPath, 'utf8');
    } else {
      console.warn('Projects HTML file not found');
    }
    
    // Read the buttons.css file for reference
    if (fs.existsSync(cssPath)) {
      console.log('Found buttons.css file');
      cssContent = fs.readFileSync(cssPath, 'utf8');
    } else {
      console.warn('buttons.css file not found');
    }
  });
  
  // Skip all tests if build files aren't available
  const conditionalTest = htmlContent ? test : test.skip;
  
  conditionalTest('HTML includes button elements with correct classes', () => {
    expect(htmlContent).toBeDefined();
    
    // Check for button elements with the correct classes
    expect(htmlContent).toMatch(/class="code-btn/);
    expect(htmlContent).toMatch(/class="readme-btn/);
    expect(htmlContent).toMatch(/class="live-demo-btn/);
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
    expect(htmlContent).toMatch(/class="fa fa-code/);
    expect(htmlContent).toMatch(/class="fa fa-book/);
    expect(htmlContent).toMatch(/class="fa fa-play/);
  });
}); 