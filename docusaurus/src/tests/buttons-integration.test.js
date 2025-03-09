/**
 * Test to verify the buttons CSS is properly loaded and applied
 */

const fs = require('fs');
const path = require('path');

describe('Buttons CSS Integration', () => {
  // Check if the buttons.css file is included in the docusaurus.config.ts
  test('buttons.css is included in the docusaurus.config.ts', () => {
    const configPath = path.resolve(__dirname, '../../docusaurus.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if buttons.css is included in the customCss array
    expect(configContent).toMatch(/customCss.*buttons\.css/);
    
    // Just check if both clientModules and buttons.css exist in the file
    expect(configContent).toContain('clientModules');
    expect(configContent).toContain('buttons.css');
  });
  
  // Check if the buttons.css file exists and has content
  test('buttons.css file exists and has content', () => {
    const cssPath = path.resolve(__dirname, '../css/buttons.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent.length).toBeGreaterThan(0);
    
    // Check if it contains styles for the button classes
    expect(cssContent).toMatch(/\.code-btn/);
    expect(cssContent).toMatch(/\.readme-btn/);
    expect(cssContent).toMatch(/\.live-demo-btn/);
    expect(cssContent).toMatch(/\.figma-btn/);
  });
  
  // Check the build directory for CSS files that include the button styles
  test('button styles are included in the built CSS', () => {
    const buildDir = path.resolve(__dirname, '../../build');
    if (!fs.existsSync(buildDir)) {
      console.warn('Build directory not found. Run "npm run build" first.');
      return;
    }
    
    // Function to recursively find CSS files in the build directory
    function findCssFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findCssFiles(filePath, fileList);
        } else if (file.endsWith('.css')) {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    }
    
    // Find all CSS files in the build directory
    const cssFiles = findCssFiles(buildDir);
    expect(cssFiles.length).toBeGreaterThan(0);
    
    // Check if any of the CSS files contain the button styles
    let foundButtonStyles = false;
    
    for (const cssFile of cssFiles) {
      const cssContent = fs.readFileSync(cssFile, 'utf8');
      if (cssContent.includes('.code-btn') || 
          cssContent.includes('.readme-btn') || 
          cssContent.includes('.live-demo-btn')) {
        foundButtonStyles = true;
        break;
      }
    }
    
    expect(foundButtonStyles).toBe(true);
  });
}); 