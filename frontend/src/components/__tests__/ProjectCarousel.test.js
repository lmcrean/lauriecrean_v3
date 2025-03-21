/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCarousel from '../ProjectCarousel';
import projectCarousels from '../../data/projectCarousels';

// Mock console.error to suppress expected error messages
console.error = jest.fn();

describe('ProjectCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ProjectCarousel projectKey="odyssey" />);
  });

  it('renders the correct number of slides for a project', () => {
    const { container } = render(<ProjectCarousel projectKey="odyssey" />);
    
    // Check slides count matches data
    const slideElements = container.querySelectorAll('.splide__slide');
    const expectedSlides = projectCarousels.odyssey.slides.length;
    
    expect(slideElements.length).toBe(expectedSlides);
  });

  it('renders the correct carousel ID', () => {
    const { container } = render(<ProjectCarousel projectKey="buffalo" />);
    
    const carousel = container.querySelector('.splide');
    expect(carousel.id).toBe('buffalo-carousel');
  });

  it('renders the correct image sources', () => {
    const { container } = render(<ProjectCarousel projectKey="coachmatrix" />);
    
    const images = container.querySelectorAll('img');
    const expectedSources = projectCarousels.coachmatrix.slides.map(slide => slide.src);
    
    images.forEach((img, index) => {
      expect(img.src).toContain(expectedSources[index]);
    });
  });

  it('returns null and logs error for invalid project key', () => {
    const { container } = render(<ProjectCarousel projectKey="nonexistent" />);
    
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));
    expect(container.innerHTML).toBe('');
  });
}); 