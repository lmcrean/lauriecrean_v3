import React from 'react';
import { render, screen } from '@testing-library/react';
import TestBadges from '../TestBadges';

describe('TestBadges', () => {
  it('renders test badges with correct URLs and formatting', () => {
    render(<TestBadges tests="vitest:303,playwright:40" />);
    
    // Check if the correct number of badges are rendered
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(2);
    
    // Check Vitest badge
    const vitestBadge = screen.getByAltText('Vitest');
    expect(vitestBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Vitest-303_Passed-1C1C1C?style=flat-square&logo=vitest&logoColor=white'
    );
    
    // Check Playwright badge
    const playwrightBadge = screen.getByAltText('Playwright');
    expect(playwrightBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Playwright-40_Passed-1C1C1C?style=flat-square&logo=playwright&logoColor=white'
    );
  });

  it('handles whitespace in test string correctly', () => {
    render(<TestBadges tests="vitest: 303 , playwright : 40" />);
    
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestBadges tests="vitest:303" className="custom-test-badges" />
    );
    
    expect((container.firstChild as HTMLElement)?.className).toBe('custom-test-badges');
  });

  it('handles multiple test frameworks', () => {
    render(<TestBadges tests="vitest:303,playwright:40,jest:5,cypress:3,python:38,pytest:20" />);
    
    const badges = screen.getAllByRole('img');
    expect(badges).toHaveLength(6);
    
    // Check all badges are present by finding them
    expect(screen.getByAltText('Vitest')).toBeTruthy();
    expect(screen.getByAltText('Playwright')).toBeTruthy();
    expect(screen.getByAltText('Jest')).toBeTruthy();
    expect(screen.getByAltText('Cypress')).toBeTruthy();
    expect(screen.getByAltText('Python')).toBeTruthy();
    expect(screen.getByAltText('Pytest')).toBeTruthy();
  });

  it('renders with custom colors', () => {
    render(<TestBadges tests="vitest:303" color="FF0000" logoColor="black" />);
    
    const badge = screen.getByAltText('Vitest');
    expect(badge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Vitest-303_Passed-FF0000?style=flat-square&logo=vitest&logoColor=black'
    );
  });

  it('handles missing count gracefully', () => {
    render(<TestBadges tests="vitest,playwright:40" />);
    
    const vitestBadge = screen.getByAltText('Vitest');
    expect(vitestBadge.getAttribute('src')).toBe(
      'https://img.shields.io/badge/Vitest-0_Passed-1C1C1C?style=flat-square&logo=vitest&logoColor=white'
    );
  });
}); 