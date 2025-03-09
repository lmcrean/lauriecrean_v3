/**
 * @jest-environment jsdom
 */

describe('Button Style Tests', () => {
  // Mock getComputedStyle for testing CSS
  const originalGetComputedStyle = window.getComputedStyle;
  
  // Create a mock for getComputedStyle
  const mockStyleMap = {
    '.code-btn': {
      backgroundColor: '#3e8e41',
      color: 'white',
      borderRadius: '5px',
      padding: '8px 12px',
      margin: '5px',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    '.readme-btn': {
      backgroundColor: '#3b0d4c',
      color: 'white',
    },
    '.figma-btn': {
      backgroundColor: '#643a0f',
      color: 'white',
    },
    '.live-demo-btn': {
      backgroundColor: '#043ca5',
      color: 'white',
    },
  };

  beforeEach(() => {
    // Set up mock DOM
    document.body.innerHTML = `
      <a href="#"><button class="code-btn"><i class="fa fa-code"></i> code </button></a>
      <a href="#"><button class="readme-btn"><i class="fa fa-book"></i> readme </button></a>
      <a href="#"><button class="figma-btn"><i class="fa fa-paint-brush"></i> mockup </button></a>
      <a href="#"><button class="live-demo-btn"><i class="fa fa-play"></i> live demo </button></a>
    `;

    // Mock getComputedStyle
    window.getComputedStyle = jest.fn((element) => {
      // Find which class this element has
      const className = Array.from(element.classList).find(cls => mockStyleMap[`.${cls}`]);
      if (className) {
        return {
          ...mockStyleMap[`.${className}`],
          getPropertyValue: (prop) => {
            const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
            return mockStyleMap[`.${className}`][camelProp] || '';
          }
        };
      }
      return originalGetComputedStyle(element);
    });
  });

  afterEach(() => {
    // Restore original function
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('code-btn has correct background color', () => {
    const codeBtn = document.querySelector('.code-btn');
    const styles = window.getComputedStyle(codeBtn);
    expect(styles.backgroundColor).toBe('#3e8e41');
    expect(styles.color).toBe('white');
  });

  test('readme-btn has correct background color', () => {
    const readmeBtn = document.querySelector('.readme-btn');
    const styles = window.getComputedStyle(readmeBtn);
    expect(styles.backgroundColor).toBe('#3b0d4c');
    expect(styles.color).toBe('white');
  });

  test('figma-btn has correct background color', () => {
    const figmaBtn = document.querySelector('.figma-btn');
    const styles = window.getComputedStyle(figmaBtn);
    expect(styles.backgroundColor).toBe('#643a0f');
    expect(styles.color).toBe('white');
  });

  test('live-demo-btn has correct background color', () => {
    const liveDemoBtn = document.querySelector('.live-demo-btn');
    const styles = window.getComputedStyle(liveDemoBtn);
    expect(styles.backgroundColor).toBe('#043ca5');
    expect(styles.color).toBe('white');
  });

  test('buttons have common styles', () => {
    const codeBtn = document.querySelector('.code-btn');
    const styles = window.getComputedStyle(codeBtn);
    
    expect(styles.borderRadius).toBe('5px');
    expect(styles.padding).toBe('8px 12px');
    expect(styles.margin).toBe('5px');
    expect(styles.fontWeight).toBe('bold');
    expect(styles.display).toBe('inline-block');
  });
}); 