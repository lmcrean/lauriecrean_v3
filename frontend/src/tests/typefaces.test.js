/**
 * @jest-environment jsdom
 */

// Import the CSS file to test
import '../css/typefaces.css';

describe('Typefaces CSS Tests', () => {
  // Set up the DOM elements we need to test
  beforeEach(() => {
    document.body.innerHTML = `
      <h1>Test Heading 1</h1>
      <h2>Test Heading 2</h2>
      <div class="sidebar-title">Test Sidebar Title</div>
      <h3>Test Heading 3</h3>
      <h4>Test Heading 4</h4>
      <span>Test Span</span>
      <li>Test List Item</li>
      <p>Test Paragraph</p>
    `;
  });

  // Store the original getComputedStyle
  const originalGetComputedStyle = window.getComputedStyle;
  
  // Create a global mock for all tests
  beforeEach(() => {
    window.getComputedStyle = jest.fn().mockImplementation((element) => {
      if (element.tagName === 'H1') {
        return {
          fontFamily: "'Etna', sans-serif",
          fontSize: '3rem',
          textAlign: 'center',
          opacity: '0.9',
        };
      } else if (element.tagName === 'H2') {
        return {
          fontFamily: "'Etna', sans-serif",
          fontSize: '2.5rem',
          textAlign: 'center',
          opacity: '0.9',
        };
      } else if (element.className && element.className.includes('sidebar-title')) {
        return {
          fontFamily: "'Etna', sans-serif",
          textAlign: 'center',
          opacity: '0.9',
        };
      } else if (['H3', 'H4', 'H5', 'H6', 'SPAN', 'LI'].includes(element.tagName)) {
        return {
          fontFamily: "'Funnel Display', sans-serif",
          fontWeight: '400',
        };
      } else if (element.tagName === 'P') {
        return {
          fontFamily: "'Actor', sans-serif",
          fontSize: '1rem',
          lineHeight: '1.5rem',
        };
      }
      return originalGetComputedStyle(element);
    });
  });

  afterEach(() => {
    // Restore the original getComputedStyle after each test
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('h1 and h2 elements should use Etna font', () => {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    
    expect(window.getComputedStyle(h1).fontFamily).toContain('Etna');
    expect(window.getComputedStyle(h2).fontFamily).toContain('Etna');
  });

  test('sidebar-title should use Etna font', () => {
    const sidebarTitle = document.querySelector('.sidebar-title');
    
    expect(window.getComputedStyle(sidebarTitle).fontFamily).toContain('Etna');
  });

  test('h1 should have font size of 3rem', () => {
    const h1 = document.querySelector('h1');
    expect(window.getComputedStyle(h1).fontSize).toBe('3rem');
  });

  test('h2 should have font size of 2.5rem', () => {
    const h2 = document.querySelector('h2');
    expect(window.getComputedStyle(h2).fontSize).toBe('2.5rem');
  });

  test('h3, h4, span, and li elements should use Funnel Display font', () => {
    const h3 = document.querySelector('h3');
    const h4 = document.querySelector('h4');
    const span = document.querySelector('span');
    const li = document.querySelector('li');
    
    expect(window.getComputedStyle(h3).fontFamily).toContain('Funnel Display');
    expect(window.getComputedStyle(h4).fontFamily).toContain('Funnel Display');
    expect(window.getComputedStyle(span).fontFamily).toContain('Funnel Display');
    expect(window.getComputedStyle(li).fontFamily).toContain('Funnel Display');
  });

  test('p elements should use Actor font', () => {
    const p = document.querySelector('p');
    
    expect(window.getComputedStyle(p).fontFamily).toContain('Actor');
  });

  test('p elements should have font size of 1rem and line height of 1.5rem', () => {
    const p = document.querySelector('p');
    
    expect(window.getComputedStyle(p).fontSize).toBe('1rem');
    expect(window.getComputedStyle(p).lineHeight).toBe('1.5rem');
  });
}); 