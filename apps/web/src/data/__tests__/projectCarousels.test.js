/**
 * @jest-environment jsdom
 */

import projectCarousels from '../projectCarousels';

describe('Project Carousels Data', () => {
  it('contains all expected projects', () => {
    // List of expected project keys
    const expectedProjects = [
      'odyssey',
      'coachmatrix',
      'steamreport',
      'buffalo',
      'lauriecrean',
      'hoverboard',
      'crocodilekingdom',
      'retrolympics',
      'wealthquest'
    ];
    
    const actualKeys = Object.keys(projectCarousels);
    
    // Check that all expected projects exist
    expectedProjects.forEach(key => {
      expect(actualKeys).toContain(key);
    });
    
    // Check for any unexpected keys
    expect(actualKeys.length).toBe(expectedProjects.length);
  });
  
  it('has the correct structure for each project', () => {
    // Mapping of keys to ID patterns (for special cases)
    const idPatterns = {
      'lauriecrean': 'laurie-crean-carousel',
      'crocodilekingdom': 'crocodile-kingdom-carousel',
      // Default pattern is key + '-carousel'
    };
    
    // Check each project has required fields
    Object.keys(projectCarousels).forEach(key => {
      const project = projectCarousels[key];
      
      // Required fields
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('label');
      expect(project).toHaveProperty('slides');
      
      // ID follows naming convention
      const expectedId = idPatterns[key] || `${key}-carousel`;
      expect(project.id).toBe(expectedId);
      
      // Slides is an array with at least one item
      expect(Array.isArray(project.slides)).toBe(true);
      expect(project.slides.length).toBeGreaterThan(0);
      
      // Each slide has required properties
      project.slides.forEach(slide => {
        expect(slide).toHaveProperty('src');
        expect(slide).toHaveProperty('alt');
        
        // Src should be a string pointing to an image
        expect(typeof slide.src).toBe('string');
        expect(slide.src).toMatch(/\.(png|jpg|jpeg|gif|webp)$/i);
      });
    });
  });
}); 