/**
 * Test to verify Font Awesome is properly loaded and applied to buttons
 */

const fs = require('fs');
const path = require('path');

describe('Font Awesome Integration', () => {
  // Check if Font Awesome is included in the docusaurus.config.ts
  test('Font Awesome is included in the docusaurus.config.ts', () => {
    const configPath = path.resolve(__dirname, '../../docusaurus.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if Font Awesome CDN is included in the stylesheets
    expect(configContent).toContain('font-awesome');
  });
  
  // Check if the buttons in projects.md use Font Awesome icons
  test('Buttons in projects.md use Font Awesome icons', () => {
    const projectsPath = path.resolve(__dirname, '../../docs/projects.md');
    const projectsContent = fs.readFileSync(projectsPath, 'utf8');
    
    // Check for Font Awesome class usage in buttons
    const codeIconPattern = /<i class="fa fa-code"><\/i>/g;
    const bookIconPattern = /<i class="fa fa-book"><\/i>/g;
    const playIconPattern = /<i class="fa fa-play"><\/i>/g;
    const paintBrushIconPattern = /<i class="fa fa-paint-brush"><\/i>/g;
    
    const codeIconMatches = projectsContent.match(codeIconPattern) || [];
    const bookIconMatches = projectsContent.match(bookIconPattern) || [];
    const playIconMatches = projectsContent.match(playIconPattern) || [];
    const paintBrushIconMatches = projectsContent.match(paintBrushIconPattern) || [];
    
    console.log(`Found ${codeIconMatches.length} code icons`);
    console.log(`Found ${bookIconMatches.length} book icons`);
    console.log(`Found ${playIconMatches.length} play icons`);
    console.log(`Found ${paintBrushIconMatches.length} paint brush icons`);
    
    // Verify that there are Font Awesome icons in the buttons
    expect(codeIconMatches.length).toBeGreaterThan(0);
    expect(bookIconMatches.length).toBeGreaterThan(0);
    expect(playIconMatches.length).toBeGreaterThan(0);
    expect(paintBrushIconMatches.length).toBeGreaterThan(0);
  });
  
  // Check if the build HTML contains Font Awesome CSS
  test('Build HTML contains Font Awesome CSS link', () => {
    const buildDir = path.resolve(__dirname, '../../build');
    
    // Skip test if build directory doesn't exist
    if (!fs.existsSync(buildDir)) {
      console.warn('Build directory not found. Run "npm run build" first.');
      return;
    }
    
    // Find the projects HTML file
    const projectsHtmlPath = path.join(buildDir, 'projects', 'index.html');
    
    // Skip test if projects HTML file doesn't exist
    if (!fs.existsSync(projectsHtmlPath)) {
      console.warn('Projects HTML file not found in build directory.');
      return;
    }
    
    // Read the projects HTML file
    const htmlContent = fs.readFileSync(projectsHtmlPath, 'utf8');
    
    // Check if Font Awesome CSS is linked in the HTML
    expect(htmlContent).toContain('font-awesome');
    
    // Look for Font Awesome icon classes in the HTML
    const codeIconPattern = /class="[^"]*fa-code[^"]*"/g;
    const bookIconPattern = /class="[^"]*fa-book[^"]*"/g;
    const playIconPattern = /class="[^"]*fa-play[^"]*"/g;
    const paintBrushIconPattern = /class="[^"]*fa-paint-brush[^"]*"/g;
    
    const codeIconMatches = htmlContent.match(codeIconPattern) || [];
    const bookIconMatches = htmlContent.match(bookIconPattern) || [];
    const playIconMatches = htmlContent.match(playIconPattern) || [];
    const paintBrushIconMatches = htmlContent.match(paintBrushIconPattern) || [];
    
    console.log(`Found ${codeIconMatches.length} code icons in the HTML`);
    console.log(`Found ${bookIconMatches.length} book icons in the HTML`);
    console.log(`Found ${playIconMatches.length} play icons in the HTML`);
    console.log(`Found ${paintBrushIconMatches.length} paint brush icons in the HTML`);
    
    // Verify that Font Awesome icons are in the HTML
    expect(codeIconMatches.length).toBeGreaterThan(0);
    expect(bookIconMatches.length).toBeGreaterThan(0);
    expect(playIconMatches.length).toBeGreaterThan(0);
    expect(paintBrushIconMatches.length).toBeGreaterThan(0);
  });
}); 