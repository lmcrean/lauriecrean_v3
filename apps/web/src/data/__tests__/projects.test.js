/**
 * @jest-environment jsdom
 */

import projects from '../projects';

describe('Projects Data', () => {
  const projectNames = Object.keys(projects);
  
  test('contains projects data', () => {
    expect(projectNames.length).toBeGreaterThan(0);
  });
  
  test('has odyssey project', () => {
    expect(projects).toHaveProperty('odyssey');
  });
  
  test('has the correct structure for each project', () => {
    projectNames.forEach(projectName => {
      const project = projects[projectName];
      
      // Required fields
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('projectTypes');
      
      // Either a single project or a multi-version project
      if (project.versions) {
        // Multi-version project
        expect(project.versions).toBeInstanceOf(Array);
        expect(project.versions.length).toBeGreaterThan(0);
        
        // Check each version
        project.versions.forEach(version => {
          expect(version).toHaveProperty('version');
          expect(version).toHaveProperty('description');
          expect(version).toHaveProperty('technologies');
          
          // Optional but common fields
          if (version.githubInfo) {
            expect(version.githubInfo).toHaveProperty('repo');
          }
          
          if (version.buttons) {
            // At least one button should be present
            const buttonTypes = Object.keys(version.buttons);
            expect(buttonTypes.length).toBeGreaterThan(0);
            
            // Check button structure
            buttonTypes.forEach(buttonType => {
              const button = version.buttons[buttonType];
              expect(button).toHaveProperty('url');
              expect(button).toHaveProperty('icon');
              expect(button).toHaveProperty('text');
            });
          }
        });
      } else {
        // Single version project
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('technologies');
        
        // Check for buttons
        if (project.buttons) {
          // At least one button should be present
          const buttonTypes = Object.keys(project.buttons);
          expect(buttonTypes.length).toBeGreaterThan(0);
          
          // Check button structure
          buttonTypes.forEach(buttonType => {
            const button = project.buttons[buttonType];
            expect(button).toHaveProperty('url');
            expect(button).toHaveProperty('icon');
            expect(button).toHaveProperty('text');
          });
        }
        
        // Check GitHub info
        if (project.githubInfo) {
          expect(project.githubInfo).toHaveProperty('repo');
        }
      }
      
      // Slides are required for all projects
      expect(project).toHaveProperty('slides');
      expect(project.slides).toBeInstanceOf(Array);
      expect(project.slides.length).toBeGreaterThan(0);
      
      // Check slide structure
      project.slides.forEach(slide => {
        expect(slide).toHaveProperty('src');
        expect(slide).toHaveProperty('alt');
      });
    });
  });
}); 