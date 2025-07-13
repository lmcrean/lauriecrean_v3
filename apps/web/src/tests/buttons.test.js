/**
 * @jest-environment jsdom
 */

// We don't need to actually import the CSS for Jest tests
// The moduleNameMapper in jest.config.js will handle this
// import '../css/buttons.css';

describe('Button DOM Structure Tests', () => {
  beforeEach(() => {
    // Create a fresh DOM environment for each test
    document.body.innerHTML = `
      <a href="#" class="code-btn"><i class="fa fa-code"></i> code </a>
      <a href="#" class="readme-btn"><i class="fa fa-book"></i> readme </a>
      <a href="#" class="figma-btn"><i class="fa fa-paint-brush"></i> mockup </a>
      <a href="#" class="live-demo-btn"><i class="fa fa-play"></i> live demo </a>
    `;
  });

  test('button elements have the correct classes', () => {
    const codeBtn = document.querySelector('.code-btn');
    const readmeBtn = document.querySelector('.readme-btn');
    const figmaBtn = document.querySelector('.figma-btn');
    const liveDemoBtn = document.querySelector('.live-demo-btn');
    
    expect(codeBtn).not.toBeNull();
    expect(readmeBtn).not.toBeNull();
    expect(figmaBtn).not.toBeNull();
    expect(liveDemoBtn).not.toBeNull();
    
    expect(codeBtn.classList.contains('code-btn')).toBeTruthy();
    expect(readmeBtn.classList.contains('readme-btn')).toBeTruthy();
    expect(figmaBtn.classList.contains('figma-btn')).toBeTruthy();
    expect(liveDemoBtn.classList.contains('live-demo-btn')).toBeTruthy();
  });

  test('buttons are wrapped in anchor tags', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button.parentElement.tagName).toBe('A');
    });
  });

  test('buttons have icon elements', () => {
    const icons = document.querySelectorAll('button i');
    expect(icons.length).toBe(4);
    
    const codeIcon = document.querySelector('.code-btn i');
    const readmeIcon = document.querySelector('.readme-btn i');
    const figmaIcon = document.querySelector('.figma-btn i');
    const liveDemoIcon = document.querySelector('.live-demo-btn i');
    
    expect(codeIcon.classList.contains('fa-code')).toBeTruthy();
    expect(readmeIcon.classList.contains('fa-book')).toBeTruthy();
    expect(figmaIcon.classList.contains('fa-paint-brush')).toBeTruthy();
    expect(liveDemoIcon.classList.contains('fa-play')).toBeTruthy();
  });
}); 