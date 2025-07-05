# @lauriecrean/observability

Centralized logging and observability utilities for the lauriecrean project, specifically designed to capture and document console.log messages from the web app during e2e testing.

## Features

- **Browser Console Logging**: Captures all console messages from the web browser during e2e tests
- **Network Activity Logging**: Tracks API calls, responses, and failures
- **Structured Logging**: Uses Winston for structured, searchable logs
- **Color-coded Console Output**: Easy-to-read terminal output with emojis and colors
- **Test Report Generation**: Automatic generation of detailed test reports
- **Concurrent Service Logging**: Integrates with concurrently to capture service output

## Installation

```bash
cd packages/observability
npm install
npm run build
```

## Usage

### Basic Usage in E2E Tests

```typescript
import { test } from '@playwright/test';
import { createTestLogger } from '@lauriecrean/observability';

test('my test with logging', async ({ page }) => {
  const logger = createTestLogger({
    testName: 'my-test',
    enableBrowserLogs: true,
    enableNetworkLogs: true
  });

  // Attach logger to page to capture browser console
  logger.attachToPage(page);

  // Your test code
  await page.goto('http://localhost:3010');

  // Log test-specific information
  logger.logInfo('Navigated to homepage');

  // Finalize and generate reports
  const reports = logger.finalize();
  console.log('Browser Report:', reports.browserReport);
});
```

### Pull Request Feed Test Example

```typescript
import { test } from '@playwright/test';
import { createPullRequestTestLogger } from '@lauriecrean/observability';

test('pull request feed with enhanced logging', async ({ page }) => {
  const logger = createPullRequestTestLogger();
  
  logger.attachToPage(page);
  logger.logInfo('Starting pull request feed test');
  
  await page.goto('http://localhost:3010/pull-request-feed');
  
  // The logger will automatically capture:
  // - All browser console.log messages
  // - API calls to /api/github/pull-requests
  // - Network failures and timeouts
  // - Page errors
  
  logger.finalize();
});
```

### Preset Loggers

The package includes preset configurations for common test scenarios:

- `createPullRequestTestLogger()` - Optimized for PR feed testing
- `createCarouselTestLogger()` - Focused on carousel functionality  
- `createFontTestLogger()` - Tracks font loading and typeface issues

### Integration with Concurrently

For tests that use concurrently to run multiple services:

```typescript
import { E2ELogger } from '@lauriecrean/observability';

const e2eLogger = new E2ELogger();

// Log service startup
e2eLogger.logServiceStart('web', 3010, 'npm run start');
e2eLogger.logServiceStart('api', 3015, 'npm run dev');

// Capture service output
webProcess.stdout?.on('data', (data) => {
  e2eLogger.logServiceOutput('web', data.toString());
});

apiProcess.stdout?.on('data', (data) => {
  e2eLogger.logServiceOutput('api', data.toString());
});
```

## Log Output

### Console Output
Logs appear in the terminal with color coding and emojis:
```
15:30:45 INFO  🧪 Test Started: pull-request-feed
15:30:46 INFO  📡 Starting web service on port 3010
15:30:47 INFO  🌐 [BROWSER] Component mounted successfully
15:30:48 ERROR ❌ [NETWORK] Request Failed: http://localhost:3015/api/github/pull-requests
```

### File Output
Structured JSON logs are saved to `test-results/`:
- `{testName}-browser-logs.json` - Browser console messages
- `{testName}-e2e-logs.json` - Complete test execution log
- `{testName}-e2e-logs-summary.json` - Test summary report

### Reports
Markdown reports are generated with:
- Error summaries by test
- Warning counts and details
- Network activity breakdown
- Test duration and performance metrics

## Configuration Options

```typescript
interface TestLoggerOptions {
  testName?: string;
  enableBrowserLogs?: boolean;    // Default: true
  enableNetworkLogs?: boolean;    // Default: true
  logToFile?: boolean;           // Default: true
  logToConsole?: boolean;        // Default: true
  filterPatterns?: string[];     // Filter specific messages
  logLevels?: LogLevel[];        // Which log levels to capture
}
```

## Log Levels

- `ERROR` - Error messages and exceptions
- `WARN` - Warning messages  
- `INFO` - Informational messages
- `DEBUG` - Debug output
- `LOG` - General console.log output

## Integration with Existing Tests

To add logging to existing e2e tests:

1. Install the observability package dependency
2. Import the appropriate logger
3. Attach to your Playwright page
4. Add test-specific logging as needed

The logger automatically captures all browser console output without requiring changes to your web application code. 