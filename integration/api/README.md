# API Integration Tests

This directory contains comprehensive integration tests for the `apps/web/src/components/api` module. These tests ensure that the API discovery, environment detection, and HTTP client functionality work correctly across different deployment scenarios.

## Test Structure

### 📁 Test Files

- **`environment.integration.test.tsx`** - Tests environment detection utilities
- **`discovery.integration.test.tsx`** - Tests port discovery and branch detection
- **`url-resolution.integration.test.tsx`** - Tests URL resolution orchestration
- **`client.integration.test.tsx`** - Tests axios client configuration and interceptors
- **`core.integration.test.tsx`** - Tests the complete API module integration

## Test Coverage

### 🌐 Environment Detection (`environment.integration.test.tsx`)

Tests the environment detection utilities that determine deployment context:

- **`getBrowserEnv()`** - Browser-compatible environment variable access
  - Tests window.__ENV__ priority
  - Tests Docusaurus customFields fallback
  - Tests import.meta.env support
  - Tests process.env fallback
  - Tests default value handling

- **`isDevelopment()`** - Development mode detection
  - Tests localhost hostname detection
  - Tests IP address detection (127.0.0.1, ::1)
  - Tests NODE_ENV variable fallback
  - Tests production hostname handling

- **`isManualTestMode()`** - Manual testing mode detection
  - Tests REACT_APP_TEST_MODE flag
  - Tests boolean string conversion
  - Tests undefined/false handling

### 🔍 Discovery (`discovery.integration.test.tsx`)

Tests the API endpoint discovery system:

- **Port Discovery**
  - Tests E2E mode port discovery (3015, 3016, 3017, 3018, 3019)
  - Tests manual test mode port discovery (3005, 3006, 3007, 3008, 3009)
  - Tests fallback behavior when all ports fail
  - Tests port caching mechanism
  - Tests error handling for network failures

- **Branch Detection**
  - Tests GitHub Actions branch name cleaning
  - Tests Firebase URL pattern parsing
  - Tests potential branch name extraction
  - Tests systematic branch pattern generation
  - Tests API URL accessibility testing
  - Tests Cloud Run URL pattern generation

### 🌐 URL Resolution (`url-resolution.integration.test.tsx`)

Tests the main URL resolution orchestration:

- **Test Environment Override**
  - Tests `window.__TEST_API_URL__` priority
  - Tests test environment detection

- **Environment Variables**
  - Tests `REACT_APP_API_BASE_URL` priority
  - Tests `DOCUSAURUS_API_BASE_URL` fallback
  - Tests undefined value filtering

- **Branch Deployment Discovery**
  - Tests Firebase hostname pattern matching
  - Tests multiple branch name attempts
  - Tests systematic pattern fallback
  - Tests production fallback when no branch found

- **Development vs Production**
  - Tests local development URL resolution
  - Tests production API URL fallback
  - Tests error handling scenarios

### 🌐 HTTP Client (`client.integration.test.tsx`)

Tests the axios client configuration and interceptors:

- **Client Configuration**
  - Tests 30-second timeout setting
  - Tests JSON content-type headers
  - Tests instance creation parameters

- **Request Interceptor**
  - Tests dynamic base URL resolution
  - Tests existing baseURL preservation
  - Tests error handling for URL resolution failures
  - Tests config property preservation

- **Response Interceptor**
  - Tests successful response pass-through
  - Tests timeout error handling (ECONNABORTED)
  - Tests 404 error message customization
  - Tests 500+ server error handling
  - Tests network error handling
  - Tests GitHub API specific errors (rate limiting, auth)

### 🔄 Core Integration (`core.integration.test.tsx`)

Tests the complete API module working together:

- **Module Exports**
  - Tests all utility function exports
  - Tests API client export
  - Tests constant exports
  - Tests backwards compatibility

- **End-to-End Scenarios**
  - Tests complete local development workflow
  - Tests complete branch deployment workflow
  - Tests complete production workflow
  - Tests error handling across all modules

## Running the Tests

### Prerequisites

```bash
cd integration
npm install
```

### Run All API Tests

```bash
npm test -- api
```

### Run Specific Test Files

```bash
# Environment tests only
npm test -- api/environment

# Discovery tests only
npm test -- api/discovery

# URL resolution tests only
npm test -- api/url-resolution

# Client tests only
npm test -- api/client

# Core integration tests only
npm test -- api/core
```

### Watch Mode

```bash
npm test -- api --watch
```

### Coverage Report

```bash
npm run test:coverage -- api
```

## Test Scenarios

### 🏠 Local Development

Tests simulate:
- `hostname: 'localhost'`
- Port discovery on 3005 (manual) or 3015 (E2E)
- Environment variable detection
- API client configuration for local endpoints

### 🌿 Branch Deployment

Tests simulate:
- Firebase hostname: `myapp--branch-123-abc123.web.app`
- Branch name extraction and cleaning
- Cloud Run URL pattern generation
- API endpoint accessibility testing
- Systematic fallback search

### 🌍 Production Deployment

Tests simulate:
- Production hostname: `myapp.com`
- Production API URL resolution
- Error handling and fallbacks
- Client configuration for production

### 🧪 Test Environment

Tests simulate:
- Test override URLs
- Environment variable injection
- Mock API responses
- Error scenarios

## Mock Strategy

The tests use comprehensive mocking to:

- **Mock `fetch`** - Control API health check responses
- **Mock `window.location`** - Simulate different deployment contexts
- **Mock environment variables** - Test various configuration scenarios
- **Mock axios** - Test HTTP client behavior without real network calls
- **Mock console** - Reduce test output noise

## Key Test Patterns

### Environment Setup

```typescript
beforeEach(() => {
  // Mock window.location for different deployment contexts
  Object.defineProperty(window, 'location', {
    value: { hostname: 'localhost' },
    writable: true,
    configurable: true
  });
  
  // Mock environment variables
  (window as any).__ENV__ = {
    REACT_APP_TEST_MODE: 'true'
  };
});
```

### API Response Mocking

```typescript
global.fetch = vi.fn()
  .mockResolvedValueOnce({ ok: false, status: 404 }) // First attempt fails
  .mockResolvedValue({ ok: true, status: 200 });     // Second attempt succeeds
```

### Error Scenario Testing

```typescript
mockGetApiPort.mockRejectedValue(new Error('Port discovery failed'));
const port = await getApiPort();
expect(port).toBe('3015'); // Should fallback gracefully
```

## Integration Benefits

These tests provide:

1. **Confidence** - Full coverage of API module functionality
2. **Regression Prevention** - Catch breaking changes early
3. **Documentation** - Living examples of expected behavior
4. **Refactoring Safety** - Ensure changes don't break existing functionality
5. **Deployment Validation** - Test all deployment scenarios

## Maintenance

When updating the API module:

1. **Update tests** to reflect new functionality
2. **Add new test scenarios** for edge cases
3. **Update mocks** to match new dependencies
4. **Run full test suite** before committing changes
5. **Update documentation** as needed

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Check vitest.config.ts alias configuration
   - Verify import paths are correct
   - Ensure dependencies are installed

2. **TypeScript Configuration Errors**
   - Check tsconfig.json extends configuration
   - Verify @docusaurus/tsconfig is available
   - Check esbuild target settings

3. **Mock Setup Issues**
   - Ensure mocks are reset between tests
   - Check mock implementation matches actual API
   - Verify mock timing and call order

### Debug Mode

```bash
# Run tests with verbose output
npm test -- api --reporter=verbose

# Run specific test with debug info
npm test -- api/environment --reporter=verbose
``` 