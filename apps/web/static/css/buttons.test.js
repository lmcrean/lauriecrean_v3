/**
 * Simple test to verify button CSS definitions are present and correctly formatted
 */

const fs = require('fs');
const path = require('path');

describe('Buttons CSS', () => {
  let cssContent;

  // Read the buttons.css file before tests
  beforeAll(() => {
    const cssPath = path.resolve(__dirname, 'buttons.css');
    cssContent = fs.readFileSync(cssPath, 'utf8');
  });

  test('buttons.css file exists and has content', () => {
    expect(cssContent).toBeDefined();
    expect(cssContent.length).toBeGreaterThan(0);
  });

  test('contains core button class definitions', () => {
    // Check for the main button classes
    expect(cssContent).toMatch(/\.code-btn/);
    expect(cssContent).toMatch(/\.readme-btn/);
    expect(cssContent).toMatch(/\.live-demo-btn/);
    expect(cssContent).toMatch(/\.figma-btn/);
  });

  test('defines button colors correctly', () => {
    // Check for color definitions
    expect(cssContent).toMatch(/\.code-btn\s*{\s*background-color:/);
    expect(cssContent).toMatch(/\.readme-btn\s*{\s*background-color:/);
    expect(cssContent).toMatch(/\.live-demo-btn\s*{\s*background-color:/);
    expect(cssContent).toMatch(/\.figma-btn\s*{\s*background-color:/);
  });

  test('defines basic button styling', () => {
    // Check for common button styling
    expect(cssContent).toMatch(/color:\s*white/);
    expect(cssContent).toMatch(/border-radius:\s*5px/);
    expect(cssContent).toMatch(/padding:/);
    expect(cssContent).toMatch(/margin:/);
  });

  test('defines hover effects', () => {
    // Check for hover effects
    expect(cssContent).toMatch(/\.code-btn:hover|\.readme-btn:hover|\.live-demo-btn:hover|\.figma-btn:hover/);
    expect(cssContent).toMatch(/transform:/);
  });

  test('does not have syntax errors in CSS', () => {
    // Basic syntax check - CSS should have matching braces
    const openBraces = (cssContent.match(/{/g) || []).length;
    const closeBraces = (cssContent.match(/}/g) || []).length;
    expect(openBraces).toBe(closeBraces);
    
    // Check for missing semicolons after properties
    // This is a simple test and not exhaustive
    const lines = cssContent.split('\n');
    for (const line of lines) {
      // Property lines should end with semicolons (excluding lines with braces or comments)
      if (line.includes(':') && !line.includes('{') && !line.includes('}') && !line.trim().startsWith('/*') && !line.trim().startsWith('*/')) {
        expect(line.trim().endsWith(';')).toBe(true);
      }
    }
  });
}); 