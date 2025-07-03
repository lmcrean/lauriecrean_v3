# Port Configuration for lauriecrean Project

This document defines the port allocation for different testing modes to avoid conflicts and enable clear separation between manual testing and end-to-end (e2e) testing.

## Port Allocation

### Manual Testing Mode
- **Web Service**: `http://localhost:3010`
- **API Service**: `http://localhost:3005`
- **Usage**: `npm run dev:manual`
- **Purpose**: For manual development and testing by developers

### End-to-End (E2E) Testing Mode  
- **Web Service**: `http://localhost:3020`
- **API Service**: `http://localhost:3015`
- **Usage**: `npm run dev:e2e` or `npm run dev`
- **Purpose**: For automated Playwright tests and CI/CD

## Environment Variables

The API service reads port configuration from `apps/api-github/.env`:

```env
GITHUB_TOKEN=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
GITHUB_USERNAME=lmcrean
PORT_MANUAL=3005
PORT_E2E=3015
NODE_ENV=development
```

## Frontend Configuration

The web service automatically detects which API port to use based on the `REACT_APP_TEST_MODE` environment variable:

- **Manual Mode**: `REACT_APP_TEST_MODE=manual` → connects to API on port 3005
- **E2E Mode**: No environment variable → connects to API on port 3015

## Available Commands

### Manual Testing
```bash
npm run dev:manual          # Start both web (3010) and API (3005)
npm run dev:web:manual      # Start only web service on port 3010
npm run dev:api:manual      # Start only API service on port 3005
```

### E2E Testing
```bash
npm run dev:e2e             # Start both web (3020) and API (3015)
npm run dev                 # Alias for dev:e2e
npm run dev:web:e2e         # Start only web service on port 3020
npm run dev:api:e2e         # Start only API service on port 3015
```

### Testing with Services
```bash
npm run test:with-services  # Start e2e services, wait for readiness, run tests
```

## Health Check Endpoints

- **Manual API**: `http://localhost:3005/health`
- **E2E API**: `http://localhost:3015/health`

## API Endpoints

- **Manual Pull Requests**: `http://localhost:3005/api/github/pull-requests`
- **E2E Pull Requests**: `http://localhost:3015/api/github/pull-requests`

## Benefits of This Setup

1. **No Port Conflicts**: Manual and e2e modes use different ports
2. **Simultaneous Running**: Both modes can run at the same time if needed
3. **Clear Separation**: Different ports make it obvious which mode you're using
4. **Automated Testing**: E2E tests always use consistent ports
5. **Developer Flexibility**: Manual testing doesn't interfere with automated processes 