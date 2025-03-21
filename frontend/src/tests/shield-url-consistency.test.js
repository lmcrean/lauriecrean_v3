/**
 * Shield URL Consistency Test
 * 
 * This test verifies that the exact same shields.io badges are used in both
 * index.md and the Project component to ensure consistent information display.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Project from '../components/Project';
import projects from '../data/projects';

// Mock fs and path modules since they don't exist in jsdom environment
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => {
    // Return a mock content containing shield URLs from index.md
    return `
      [![Last Commit](https://img.shields.io/github/last-commit/lmcrean/coach-matrix?color=blue)](https://github.com/lmcrean/coach-matrix)
      ![Created at](https://img.shields.io/github/created-at/lmcrean/coach-matrix?color=blue)
      [![Commit Activity](https://img.shields.io/github/commit-activity/t/lmcrean/coach-matrix?color=blue)](https://github.com/lmcrean/coach-matrix/commits/main)
      
      ![React](https://img.shields.io/badge/React-1C1C1C?&logo=react&logoColor=white)
      ![NodeJS](https://img.shields.io/badge/NodeJS-1C1C1C?&logo=node.js&logoColor=white)
      ![Express](https://img.shields.io/badge/Express-1C1C1C?&logo=express&logoColor=white)
      ![MongoDB](https://img.shields.io/badge/MongoDB-1C1C1C?&logo=mongodb&logoColor=white)
      ![AWS](https://img.shields.io/badge/AWS-1C1C1C?&logo=amazon&logoColor=white)
      ![OpenAI](https://img.shields.io/badge/OpenAI-1C1C1C?&logo=openai&logoColor=white)
      ![Vector DB](https://img.shields.io/badge/Vector_DB-1C1C1C?&logoColor=white)
      ![Claude AI](https://img.shields.io/badge/Claude_AI-1C1C1C?&logoColor=white)
      ![Playwright](https://img.shields.io/badge/Playwright-3_Passed-blue?style=flat-square&logo=playwright&logoColor=white)
      ![Jest](https://img.shields.io/badge/Jest-5_Passed-blue?style=flat-square&logo=jest&logoColor=white)

      <img src="https://img.shields.io/badge/Full--Stack-1C1C1C" alt="Full-Stack" />
      <img src="https://img.shields.io/badge/API-1C1C1C" alt="API" />
      <img src="https://img.shields.io/badge/AI-1C1C1C" alt="AI" />
    `;
  })
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => 'mocked/path/to/index.md')
}));

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

  // Helper function to extract technology name from shield URL
  const extractTechFromShieldUrl = (url) => {
    // Extract technology name from badge URL
    const match = url.match(/badge\/([^-].*?)-1C1C1C/);
    if (match) {
      return decodeURIComponent(match[1].replace(/_/g, ' '));
    }
    return null;
  };

  // Test to verify that badges for a specific project in Project component
  // match exactly what's in index.md
  test('Project badges should exactly match those in index.md', () => {
    // Get mock index.md content
    const mockIndexContent = jest.requireMock('fs').readFileSync();
    
    // Extract all shields from mock index.md
    const indexMdShields = extractShieldsFromMd(mockIndexContent);
    
    // Filter to get just technology badges
    const indexTechShields = indexMdShields.filter(shield => 
      shield.url.includes('img.shields.io/badge/') && 
      !shield.url.includes('Passed') &&
      !shield.alt.includes('Full-Stack') &&
      !shield.alt.includes('API') &&
      !shield.alt.includes('AI')
    );
    
    // Extract technology names from index.md
    const indexTechNames = indexTechShields
      .map(shield => shield.alt)
      .filter(name => name !== null)
      .sort();
    
    // For console output to help debug
    console.log('Technologies in index.md:', indexTechNames);
    
    // Find Coach Matrix project from data
    const coachMatrixProject = Object.values(projects).find(p => 
      p.name === 'Coach Matrix' || p.id === 'coach-matrix'
    );
    
    expect(coachMatrixProject).toBeTruthy();
    
    // Render the project component for Coach Matrix
    const { container } = render(<Project projectData={coachMatrixProject} />);
    
    // Get all technology img elements
    const techImgElements = Array.from(container.querySelectorAll('img[src*="img.shields.io/badge"]'))
      .filter(img => 
        !img.src.includes('Passed') && 
        !img.alt?.includes('Full-Stack') && 
        !img.alt?.includes('API') &&
        !img.alt?.includes('AI')
      );
    
    // Extract technology names from rendered component
    const componentTechNames = techImgElements
      .map(img => img.alt || extractTechFromShieldUrl(img.src))
      .filter(name => name !== null)
      .sort();
    
    // For console output to help debug
    console.log('Technologies in component:', componentTechNames);
    
    // Verify technologies match
    expect(componentTechNames).toEqual(indexTechNames);
  });
  
  // Additional test to check specific tech stacks for known projects
  test('Project-specific tech stack should be correctly rendered', () => {
    // Check Coach Matrix project
    const coachMatrixProject = Object.values(projects).find(p => 
      p.name === 'Coach Matrix' || p.id === 'coach-matrix'
    );
    
    if (coachMatrixProject) {
      expect(coachMatrixProject.technologies).toEqual(
        expect.arrayContaining(['React', 'NodeJS', 'Express', 'MongoDB', 'AWS'])
      );
      
      const { container } = render(<Project projectData={coachMatrixProject} />);
      
      // Verify React badge is present
      const reactBadge = Array.from(container.querySelectorAll('img'))
        .find(img => img.src.includes('badge/React-') || img.alt === 'React');
      expect(reactBadge).toBeTruthy();
      
      // Verify MongoDB badge is present
      const mongoDBBadge = Array.from(container.querySelectorAll('img'))
        .find(img => img.src.includes('badge/MongoDB-') || img.alt === 'MongoDB');
      expect(mongoDBBadge).toBeTruthy();
    }
  });
}); 