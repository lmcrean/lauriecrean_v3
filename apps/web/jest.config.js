module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/.cache/', 
    '/build/',
    '/tests-e2e/'  // Exclude Playwright E2E tests directory
  ],
}; 