import { test, expect } from '@playwright/test';

/**
 * Test to directly check if font files are accessible in production
 */
test.describe('Font File Accessibility', () => {
  
  test('should be able to directly access font files', async ({ page, request }) => {
    // Try to fetch each font file directly
    const fontFiles = [
      '/fonts/GlacialIndifference-Regular.woff',
      '/fonts/GlacialIndifference-Bold.woff',
      '/fonts/Actor-Regular.ttf',
      '/fonts/FunnelDisplay-VariableFont_wght.ttf'
    ];
    
    for (const fontFile of fontFiles) {
      console.log(`Checking font file: ${fontFile}`);
      
      // Create the full URL using localhost instead of production
      const url = new URL(fontFile, 'http://localhost:3000').href;
      console.log(`Full URL: ${url}`);
      
      // Try to fetch the file
      const response = await request.get(url);
      
      // Check if the file was found (status 200)
      console.log(`Status: ${response.status()}`);
      
      // We don't expect this to be HTML
      const contentType = response.headers()['content-type'];
      console.log(`Content-Type: ${contentType}`);
      
      // If we get HTML instead of a font file, that means the file wasn't found
      expect(contentType).not.toContain('text/html');
    }
  });
}); 