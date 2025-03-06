// Add any global test setup here
import '@testing-library/jest-dom';

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}; 