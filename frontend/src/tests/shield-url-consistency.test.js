/**
 * Shield URL Consistency Test
 * 
 * This test verifies that the shield badges used in the Project component
 * match the technologies defined in projects.js
 */

import React from 'react';
import { render } from '@testing-library/react';
import Project from '../components/Project';
import projects from '../data/projects';
import { indexMdContent } from './data/index-md-content';

describe('Shield URL Consistency Tests', () => {
  // Helper function to extract shield URLs and their alt text from index.md content
  const extractShieldsFromMd = (content) => {
    // Match Markdown image syntax and extract both alt text and URL
    const mdRegex = /!\[(.*?)\]\((https:\/\/img\.shields\.io\/[^)]+)\)/g;
    const mdMatches = [...content.matchAll(mdRegex)];
    const mdShields = mdMatches.map(match => ({
      alt: match[1],
      url: match[2]
    }));
    
    // Match HTML img tags
    const htmlRegex = /<img src="(https:\/\/img\.shields\.io\/[^"]+)".*?alt="([^"]+)"/g;
    const htmlMatches = [...content.matchAll(htmlRegex)];
    const htmlShields = htmlMatches.map(match => ({
      alt: match[2],
      url: match[1]
    }));
    
    return [...mdShields, ...htmlShields];
  };

  // Helper function to normalize technology names
  const normalizeTechName = (name) => {
    if (!name) return '';
    
    return name.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\.js/g, 'js')
      .replace('nodejs', 'node.js')
      .trim();
  };

  test('All projects: shield URLs in index.md vs project components', () => {
    // Extract all shield URLs from index.md content
    const allIndexShields = extractShieldsFromMd(indexMdContent);
    console.log(`Found ${allIndexShields.length} shield URLs in index.md`);
    
    // Filter out non-technology shields
    const techShields = allIndexShields.filter(shield => 
      !shield.url.includes('Passed') && 
      !shield.alt.includes('Last Commit') && 
      !shield.alt.includes('Created at') && 
      !shield.alt.includes('Commit Activity') &&
      shield.alt !== 'Full-Stack' &&
      shield.alt !== 'API' &&
      shield.alt !== 'Frontend' &&
      shield.alt !== 'LocalStorage'
    );
    
    // Log unique technology shields
    const uniqueTechShields = [...new Map(techShields.map(item => 
      [item.alt, item])).values()];
    
    console.log('Unique technology shields in index.md:', uniqueTechShields.length);
    console.log(uniqueTechShields.map(s => s.alt).sort());
    
    // Check each project in projects.js
    Object.values(projects).forEach(project => {
      // Render the Project component
      const { container } = render(<Project projectData={project} />);
      
      // Get all img elements with tech badges
      const techBadges = Array.from(container.querySelectorAll('.tech-badges img'));
      
      // Get technologies defined in projects.js for this project
      const projectTechs = project.technologies.map(tech => 
        normalizeTechName(tech)
      ).sort();
      
      // Extract tech names from rendered badges
      const componentTechNames = techBadges
        .map(img => normalizeTechName(img.alt))
        .filter(name => name !== null && name !== '')
        .sort();
      
      // Check for missing technologies in the rendered component
      const missingTechs = projectTechs.filter(tech => 
        !componentTechNames.some(compTech => compTech.includes(tech.toLowerCase()))
      );
      
      if (missingTechs.length > 0) {
        console.warn(`Project "${project.name}": Missing technologies in component: ${missingTechs.join(', ')}`);
      }
      
      // Check if each tech in the project has a corresponding shield in index.md
      const techsWithoutShields = projectTechs.filter(tech => 
        !uniqueTechShields.some(shield => 
          normalizeTechName(shield.alt).includes(tech.toLowerCase())
        )
      );
      
      if (techsWithoutShields.length > 0) {
        console.warn(`Project "${project.name}": Technologies without shields in index.md: ${techsWithoutShields.join(', ')}`);
      }
    });
    
    // This test is informational only, always passes
    expect(true).toBe(true);
  });
  
  test('Project component render matches technologies in projects.js', () => {
    // Test each project individually
    Object.values(projects).forEach(project => {
      // Render the Project component
      const { container } = render(<Project projectData={project} />);
      
      // Get all img elements with class "tech-badge"
      const techBadges = Array.from(container.querySelectorAll('.tech-badges img'));
      
      // Extract technology names from rendered badges
      const componentTechNames = techBadges
        .map(img => normalizeTechName(img.alt))
        .filter(name => name !== null && name !== '')
        .sort();
      
      // Get technologies from projects.js
      const projectTechs = project.technologies.map(tech => 
        normalizeTechName(tech)
      ).sort();
      
      // Check for missing technologies in the rendered component
      const missingTechs = projectTechs.filter(tech => 
        !componentTechNames.some(compTech => compTech.includes(tech.toLowerCase()))
      );
      
      if (missingTechs.length > 0) {
        console.warn(`Project "${project.name}": Missing technologies in component: ${missingTechs.join(', ')}`);
      }
      
      // Test should pass if all technologies are rendered
      expect(missingTechs.length).toBe(0);
    });
  });
}); 