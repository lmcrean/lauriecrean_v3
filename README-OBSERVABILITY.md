# Observability Logging Implementation

This document explains the observability logging system implemented in the `/packages/observability` directory that captures console.log messages from the web app during e2e testing.

## 🎯 Overview

The observability package provides centralized logging that captures:
- **Browser console messages** from the web app during testing
- **Network activity** including API calls and failures
- **Service output** from concurrently running processes
- **Test execution flow** with detailed reporting

## 📁 Package Structure

```
packages/observability/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript type definitions
│   ├── browser-logger.ts     # Browser console capture
│   ├── e2e-logger.ts         # E2E test suite logging
│   └── test-logger.ts        # Factory functions and presets
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Features

### Browser Console Logging
- Captures all `console.log()`, `console.error()`, `console.warn()`, etc. from the web app
- Color-coded output with emojis for easy identification
- Structured JSON logs with timestamps and metadata
- Automatic filtering and log level management

### Network Activity Tracking
- Monitors API requests and responses
- Tracks network failures and timeouts
- Records response times and status codes
- Special focus on GitHub API calls

### Service Integration
- Integrates with concurrently to capture service output
- Logs from both web and API servers
- Service startup/shutdown tracking
- Health check monitoring

### Report Generation
- Automatic Markdown reports
- JSON structured logs for analysis
- Test summary statistics
- Error and warning categorization

## 🔧 Installation & Setup

1. **Install observability package dependencies:**
   ```bash
   cd packages/observability
   npm install
   npm run build
   ```

2. **Install in e2e tests:**
   ```bash
   cd e2e
   npm install  # This installs the local observability package
   ```

## 📝 Usage Examples

### Basic Browser Console Capture

```typescript
import { createTestLogger } from '@lauriecrean/observability';

test('my test with logging', async ({ page }) => {
  const logger = createTestLogger({
    testName: 'my-test',
    enableBrowserLogs: true,
    enableNetworkLogs: true
  });

  // Attach to page - captures all browser console messages
  logger.attachToPage(page);

  await page.goto('http://localhost:3010');
  
  // Your web app's console.log messages are now being captured!
  
  const reports = logger.finalize();
  console.log(`Captured ${reports.browserLogs.length} browser messages`);
});
```

### Preset Loggers for Common Scenarios

```typescript
import { createPullRequestTestLogger } from '@lauriecrean/observability';

test('PR feed test', async ({ page }) => {
  const logger = createPullRequestTestLogger(); // Pre-configured for PR testing
  logger.attachToPage(page);
  
  await page.goto('http://localhost:3010/pull-request-feed');
  // Automatically captures PR-related console output and API calls
  
  logger.finalize();
});
```

### Service Integration with Concurrently

```typescript
import { E2ELogger } from '@lauriecrean/observability';

const e2eLogger = new E2ELogger();

// Log service startup
e2eLogger.logServiceStart('web', 3010, 'npm run start');

// Capture web server output
webProcess.stdout?.on('data', (data) => {
  e2eLogger.logServiceOutput('web', data.toString());
});
```

## 🧪 Running Tests with Observability

### Quick Test (without starting services)
```bash
cd e2e
npm run test:observability
```

### Full Integration Test (with concurrently services)
```bash
cd e2e
npm run test:observability:with-services
```

### Individual Example Tests
```bash
# Run the example test file
npx playwright test example-with-logging.spec.ts

# Run the enhanced PR test
npx playwright test enhanced-pull-request-test.spec.ts
```

## 📊 Output and Reports

### Console Output
During test execution, you'll see color-coded logs:
```
15:30:45 INFO  🧪 Test Started: pull-request-feed
15:30:47 INFO  🌐 [BROWSER] Component mounted successfully
15:30:48 ERROR ❌ [NETWORK] Request Failed: timeout
15:30:49 INFO  📡 [WEB] Server listening on port 3010
```

### File Output
Structured logs are saved to `test-results/`:
- `{testName}-browser-logs.json` - All browser console messages
- `{testName}-e2e-logs.json` - Complete test execution log
- `{testName}-e2e-logs-summary.json` - Summary with error counts

### Markdown Reports
Automatic reports include:
- Error summaries grouped by test
- Warning counts and details
- Network activity breakdown
- Test performance metrics

## ⚙️ Configuration Options

```typescript
interface TestLoggerOptions {
  testName?: string;              // Test identifier
  enableBrowserLogs?: boolean;    // Capture browser console (default: true)
  enableNetworkLogs?: boolean;    // Capture network activity (default: true)
  logToFile?: boolean;           // Save to JSON files (default: true)
  logToConsole?: boolean;        // Show in terminal (default: true)
  filterPatterns?: string[];     // Filter specific messages
  logLevels?: LogLevel[];        // Which levels to capture
}
```

### Log Levels
- `ERROR` - Error messages and exceptions
- `WARN` - Warning messages
- `INFO` - Informational messages
- `DEBUG` - Debug output
- `LOG` - General console.log output

## 🎨 Color Coding

Terminal output uses colors and emojis for quick visual identification:
- 🚀 Test suite operations
- 🌐 Browser console messages
- 📡 Network activity
- ❌ Errors and failures
- ⚠️ Warnings
- ✅ Success states
- 📊 Reports and summaries

## 🔍 Debugging Tips

1. **Check browser logs first**: Most web app issues show up in browser console
2. **Use filter patterns**: Focus on specific components or APIs
3. **Enable network logging**: Track API timeouts and failures
4. **Check test-results/ directory**: Full logs and reports are saved there
5. **Use headed mode**: See browser interactions: `npm run test:observability:headed`

## 🤝 Integration with Existing Tests

To add observability to existing e2e tests:

1. Import the logger: `import { createTestLogger } from '@lauriecrean/observability'`
2. Create logger with appropriate config
3. Attach to page: `logger.attachToPage(page)`
4. Finalize at end: `logger.finalize()`

The logger automatically captures ALL browser console output without requiring changes to your web application code.

## 📈 Benefits

- **Faster debugging**: Immediate visibility into browser console during tests
- **Better test reporting**: Structured logs with context and metadata
- **Service monitoring**: Track all processes in your test environment
- **Performance insights**: Response times and error patterns
- **Historical data**: JSON logs for trend analysis

This observability system transforms your e2e testing from "black box" to full visibility, making debugging and monitoring much more effective. 