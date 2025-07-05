# Dual-Service E2E Test for Pull Request Feed

This test recreates and debugs the timeout error when the Pull Request Feed component tries to connect to the GitHub API.

## What it tests

1. **Service Integration**: Starts both the web app (localhost:3000) and API server (localhost:3001) concurrently
2. **Timeout Error Recreation**: Monitors for AxiosError timeout issues when fetching pull requests  
3. **API Health**: Tests the API endpoints directly to verify they're working
4. **Network Monitoring**: Captures all API requests/responses with detailed logging

## Prerequisites

Make sure you have a `.env` file in `apps/api-github/` with:
```
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_USERNAME=lmcrean
PORT=3001
NODE_ENV=development
```

## Running the test

### With browser visible (recommended for debugging):
```bash
cd apps/web
npm run test:e2e:dual-service
```

### Headless mode:
```bash
cd apps/web  
npm run test:e2e:dual-service:headless
```

## What the test does

1. **Setup Phase**: Starts both services and waits 15 seconds for startup
2. **Health Checks**: Verifies both servers are responding
3. **Main Test**: 
   - Navigates to `/pull-request-feed` page
   - Monitors network requests for API calls
   - Captures console errors (including AxiosError timeouts)
   - Takes screenshots for debugging
4. **Direct API Tests**: Tests API endpoints independently

## Expected outcomes

- **If timeout error exists**: Test passes and logs the exact error details
- **If API works**: Test passes and confirms successful API integration  
- **If services fail to start**: Test fails with detailed startup logs

## Debugging

The test creates screenshots in `e2e/screenshots/`:
- `pull-request-debug.png` - Page state when component isn't found
- `pull-request-final.png` - Final page state

All API requests/responses are logged to console with detailed timestamps and status codes.

## Configuration

The test uses `playwright.dual-service.config.ts` which:
- Runs only 1 worker to avoid port conflicts
- Increases timeouts for service startup (2 minutes per test)  
- Doesn't auto-start web server (test manages both services manually)
- Uses Safari browser only (per project requirements) 