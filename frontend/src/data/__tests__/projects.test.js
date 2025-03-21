/**
 * @jest-environment jsdom
 */

import projects from '../projects';
import projectCarousels from '../projectCarousels';

describe('Projects Data', () => {
  it('contains all expected projects', () => {
    // List of expected project keys
    const expectedProjects = [
      'odyssey',
      'coachmatrix',
      'steamreport',
      'buffalo',
      'lauriecrean',
      'hoverboard',
      'crocodilekingdom'
    ];
    
    const actualKeys = Object.keys(projects);
    
    // Check that all expected projects exist
    expectedProjects.forEach(key => {
      expect(actualKeys).toContain(key);
    });
    
    // Check for any unexpected keys
    expect(actualKeys.length).toBe(expectedProjects.length);
  });
  
  it('has the correct structure for each project', () => {
    // Check each project has required fields
    Object.keys(projects).forEach(key => {
      const project = projects[key];
      
      // Required fields
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('version');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('technologies');
      expect(project).toHaveProperty('repositoryUrl');
      expect(project).toHaveProperty('liveDemoUrl');
      expect(project).toHaveProperty('slides');
      
      // ID follows naming convention
      expect(project.id).toBe(`${key}-project`);
      
      // Version follows semantic versioning pattern
      expect(project.version).toMatch(/^\d+\.\d+\.\d+$/);
      
      // Technologies is an array with at least one item
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(project.technologies.length).toBeGreaterThan(0);
      
      // Repository and demo URLs are valid URLs
      expect(project.repositoryUrl).toMatch(/^https?:\/\//);
      expect(project.liveDemoUrl).toMatch(/^https?:\/\//);
    });
  });
  
  it('uses slides from projectCarousels', () => {
    // Check that slides are properly imported from projectCarousels
    Object.keys(projects).forEach(key => {
      if (projectCarousels[key]) {
        expect(projects[key].slides).toBe(projectCarousels[key].slides);
      }
    });
  });
}); 