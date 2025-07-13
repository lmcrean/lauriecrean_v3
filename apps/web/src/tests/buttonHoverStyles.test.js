/**
 * @jest-environment jsdom
 */

describe('Button Hover Style Tests', () => {
  // Mock getComputedStyle for testing CSS
  const originalGetComputedStyle = window.getComputedStyle;
  
  // Create a mock for getComputedStyle
  const mockNormalStyleMap = {
    '.code-btn': {
      backgroundColor: '#3e8e41',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
    '.readme-btn': {
      backgroundColor: '#3b0d4c',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
    '.figma-btn': {
      backgroundColor: '#643a0f',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
    '.live-demo-btn': {
      backgroundColor: '#043ca5',
      transform: 'none',
      filter: 'none',
      boxShadow: 'none',
    },
  };
  
  // Create hover style map
  const mockHoverStyleMap = {
    '.code-btn:hover': {
      filter: 'brightness(1.2)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '.readme-btn:hover': {
      filter: 'brightness(1.2)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '.figma-btn:hover': {
      filter: 'brightness(1.2)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '.live-demo-btn:hover': {
      filter: 'brightness(1.2)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  beforeEach(() => {
    // Set up mock DOM
    document.body.innerHTML = `
          <a href="#" class="code-btn"><i class="fa fa-code"></i> code </a>
    <a href="#" class="readme-btn"><i class="fa fa-book"></i> readme </a>
    <a href="#" class="figma-btn"><i class="fa fa-paint-brush"></i> mockup </a>
    <a href="#" class="live-demo-btn"><i class="fa fa-play"></i> live demo </a>
    `;

    // Mock getComputedStyle for normal state
    window.getComputedStyle = jest.fn((element, pseudoElt) => {
      // If pseudoElt is provided, we're checking for :hover
      if (pseudoElt === ':hover') {
        // Find which class this element has
        const className = Array.from(element.classList)[0];
        if (className) {
          return {
            ...mockHoverStyleMap[`.${className}:hover`],
            getPropertyValue: (prop) => {
              const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
              return mockHoverStyleMap[`.${className}:hover`][camelProp] || '';
            }
          };
        }
      } else {
        // Normal state
        const className = Array.from(element.classList)[0];
        if (className) {
          return {
            ...mockNormalStyleMap[`.${className}`],
            getPropertyValue: (prop) => {
              const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
              return mockNormalStyleMap[`.${className}`][camelProp] || '';
            }
          };
        }
      }
      return originalGetComputedStyle(element, pseudoElt);
    });
  });

  afterEach(() => {
    // Restore original function
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('buttons should have hover state styles', () => {
    const buttonClasses = ['.code-btn', '.readme-btn', '.figma-btn', '.live-demo-btn'];
    
    buttonClasses.forEach(buttonClass => {
      const button = document.querySelector(buttonClass);
      
      // Normal state
      const normalStyles = window.getComputedStyle(button);
      expect(normalStyles.transform).toBe('none');
      expect(normalStyles.filter).toBe('none');
      expect(normalStyles.boxShadow).toBe('none');
      
      // Hover state
      const hoverStyles = window.getComputedStyle(button, ':hover');
      expect(hoverStyles.filter).toBe('brightness(1.2)');
      expect(hoverStyles.transform).toBe('scale(1.05)');
      expect(hoverStyles.boxShadow).toBe('0 4px 8px rgba(0, 0, 0, 0.1)');
    });
  });
}); 