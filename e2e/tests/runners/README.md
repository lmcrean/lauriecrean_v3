# E2E Test Runners

This directory contains modular test runners that organize E2E test functionality into reusable components. The runners pattern allows for better organization, maintainability, and reusability of test code.

## Directory Structure

```bash
e2e/tests/
├── features/           # Master test operations
│   ├── pull-request/
│   │   ├── pull-request-detail.api.spec.ts
│   │   ├── pull-request-detail.spec.ts
│   │   └── pull-request-feed.api.spec.ts
│   ├── health/
│   └── frontend/
├── runners/   # always <100 lines
│   ├── utilities/        # not setup specific runners
│   ├── setup/             # Setup files before each test <100 lines
│   │   ├── observability-runner.ts
│   │   └── service-manager.ts
│   └── pull-request/          # Feature-specific runners
│       ├── pull-request-detail.api.ts
│       └── pull-request-detail.web.ts
|   └── teardown/       # teardown files after each test <100 lines
│   index.ts # exports all runners
```

## Available Runners

### Service Management

#### `ServiceManager`
Handles starting, stopping, and health checking of web and API services.

```typescript
import { ServiceManager, ServiceManagerConfig } from './runners';

const config: ServiceManagerConfig = {
  webPort: 3010,
  apiPort: 3015,
  startupWaitTime: 15000,
  logFilePath: 'test-results/logs.json'
};

const serviceManager = new ServiceManager(config);
await serviceManager.startServices();
await serviceManager.performHealthChecks();
await serviceManager.stopServices();
```

### Web Runners

#### `PullRequestFeedRunner`
Tests the pull request feed UI functionality, including timeout error reproduction and component detection.

```typescript
import { PullRequestFeedRunner } from './runners';

const runner = new PullRequestFeedRunner(logger, webPort);
const results = await runner.runTimeoutReproductionTest(page);
await runner.assertTestSuccess(results);
```

#### `LandingRunner`
Tests the landing page functionality and accessibility.

```typescript
import { LandingRunner } from './runners';

const runner = new LandingRunner(logger, webPort);
await runner.runLandingPageTest(page);
const isHealthy = await runner.checkLandingPageHealth(page);
```

### API Runners

#### `HealthRunner`
Tests API health endpoints to verify service availability.

```typescript
import { HealthRunner } from './runners';

const runner = new HealthRunner(logger, apiPort);
await runner.runHealthCheck(page);
```

#### `PullRequestApiRunner`
Tests pull request API endpoints directly, both with and without UI.

```typescript
import { PullRequestApiRunner, PullRequestApiTestConfig } from './runners';

const config: PullRequestApiTestConfig = {
  username: 'lmcrean',
  page: 1,
  perPage: 5,
  timeout: 15000
};

const runner = new PullRequestApiRunner(logger, apiPort);
await runner.runDirectApiTest(page, config);
const result = await runner.testApiEndpointWithoutUI(config);
```

## Usage Example

Here's how the refactored test file uses these runners:

```typescript
import { test } from '@playwright/test';
import { 
  ServiceManager, 
  ServiceManagerConfig,
  PullRequestFeedRunner,
  HealthRunner,
  PullRequestApiRunner 
} from './runners';

test.describe('Pull Request Feed Integration', () => {
  let serviceManager: ServiceManager;
  let feedRunner: PullRequestFeedRunner;
  let healthRunner: HealthRunner;
  let apiRunner: PullRequestApiRunner;
  
  test.beforeAll(async () => {
    serviceManager = new ServiceManager(config);
    const logger = serviceManager.getLogger();
    
    feedRunner = new PullRequestFeedRunner(logger, config.webPort);
    healthRunner = new HealthRunner(logger, config.apiPort);
    apiRunner = new PullRequestApiRunner(logger, config.apiPort);
    
    await serviceManager.startServices();
    await serviceManager.performHealthChecks();
  });
  
  test.afterAll(async () => {
    await serviceManager.stopServices();
  });

  test('timeout reproduction test', async ({ page }) => {
    const results = await feedRunner.runTimeoutReproductionTest(page);
    await feedRunner.assertTestSuccess(results);
  });

  test('health check', async ({ page }) => {
    await healthRunner.runHealthCheck(page);
  });

  test('direct API test', async ({ page }) => {
    await apiRunner.runDirectApiTest(page, apiConfig);
  });
});
```

## Benefits of the Runners Pattern

1. **Modularity**: Each runner handles a specific responsibility
2. **Reusability**: Runners can be used across multiple test files
3. **Maintainability**: Changes to test logic are isolated to specific runners
4. **Testability**: Runners can be unit tested independently
5. **Organization**: Clear separation between different types of tests
6. **Configuration**: Centralized configuration management
7. **Logging**: Consistent logging across all test components

## Adding New Runners

To add a new runner:

1. Create the runner file in the appropriate directory
2. Implement the runner class with the required functionality
3. Export the runner from the `index.ts` file
4. Update this README with documentation
5. Add tests that use the new runner

## Dependencies

All runners use the following core dependencies:
- `@playwright/test` for browser automation
- `@lauriecrean/observability` for logging
- Node.js `child_process` for service management (ServiceManager only) 