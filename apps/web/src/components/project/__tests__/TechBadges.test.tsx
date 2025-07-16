import React from 'react';
import { render, screen } from '@testing-library/react';
import TechBadges from '../TechBadges';

describe('TechBadges', () => {
  it('renders tech badges with correct URLs and alt text', () => {
    render(<TechBadges values="typescript,react,express" />);
    
    // Check if the correct number of badges are rendered
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(3);
    
    // Check TypeScript badge
    const typescriptBadge = screen.getByAltText('Typescript');
    expect(typescriptBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Typescript-1C1C1C?&logo=typescript&logoColor=white'
    );
    
    // Check React badge
    const reactBadge = screen.getByAltText('React');
    expect(reactBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/React-1C1C1C?&logo=react&logoColor=white'
    );
    
    // Check Express badge
    const expressBadge = screen.getByAltText('Express');
    expect(expressBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Express-1C1C1C?&logo=express&logoColor=white'
    );
  });

  it('handles whitespace in values correctly', () => {
    render(<TechBadges values="typescript, react , express" />);
    
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(3);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TechBadges values="typescript" className="custom-tech-badges" />
    );
    
    expect((container.firstChild as HTMLElement)?.className).toBe('custom-tech-badges');
  });

  it('handles unknown technologies with fallback', () => {
    render(<TechBadges values="unknowntech" />);
    
    const badge = screen.getByAltText('Unknowntech');
    expect(badge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Unknowntech-1C1C1C?&logo=unknowntech&logoColor=white'
    );
  });

  it('renders with custom colors', () => {
    render(<TechBadges values="typescript" color="FF0000" logoColor="black" />);
    
    const badge = screen.getByAltText('Typescript');
    expect(badge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Typescript-FF0000?&logo=typescript&logoColor=black'
    );
  });
}); 