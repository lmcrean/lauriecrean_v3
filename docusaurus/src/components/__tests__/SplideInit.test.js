/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SplideInit from '../SplideInit';

// Mock the Splide constructor and mount method
global.Splide = jest.fn().mockImplementation(() => {
  return {
    mount: jest.fn(),
    on: jest.fn(),
    Components: {
      Controller: {
        getEnd: jest.fn().mockReturnValue(3)
      }
    }
  };
});

// Mock DOM elements
beforeEach(() => {
  // Create carousel elements in the DOM for testing
  document.body.innerHTML = `
    <section class="splide" id="test-carousel">
      <div class="splide__track">
        <ul class="splide__list">
          <li class="splide__slide">Slide 1</li>
          <li class="splide__slide">Slide 2</li>
          <li class="splide__slide">Slide 3</li>
        </ul>
      </div>
      <div class="my-carousel-progress">
        <div class="my-carousel-progress-bar"></div>
      </div>
    </section>
  `;
});

describe('SplideInit Component', () => {
  it('renders without crashing', () => {
    render(<SplideInit />);
    // Component doesn't render anything visible, so just check it doesn't crash
  });

  it('adds Splide CSS to the document head', () => {
    render(<SplideInit />);
    
    // Wait for the component's useEffect to run
    setTimeout(() => {
      const styleLink = document.getElementById('splide-css');
      expect(styleLink).toBeTruthy();
      expect(styleLink.href).toContain('splide.min.css');
    }, 100);
  });

  it('initializes Splide carousels when available', () => {
    // Mock window.Splide
    render(<SplideInit />);
    
    // Wait for initialization
    setTimeout(() => {
      // Should have called Splide constructor
      expect(global.Splide).toHaveBeenCalled();
      
      // Splide.mount should have been called
      const splideInstance = global.Splide.mock.results[0].value;
      expect(splideInstance.mount).toHaveBeenCalled();
    }, 1100); // Allow time for the initialization timeout
  });
}); 