# API Module Structure

This module provides a clean, organized approach to handling API communication and endpoint discovery.

## Directory Structure

```
apps/web/src/components/api/
├── Core.ts                    # Main entry point - re-exports all utilities
├── environment/               # Environment detection and variable access
│   ├── browserEnv.ts         # Browser environment variable access
│   └── detection.ts          # Development/test mode detection
├── discovery/                 # API endpoint discovery
│   ├── portDiscovery.ts      # Local development port discovery
│   ├── branchDetection.ts    # Branch deployment pattern matching
│   └── urlResolution.ts      # Main URL resolution orchestration
├── client/                    # HTTP client configuration
│   └── axiosClient.ts        # Axios instance with interceptors
└── README.md                 # This documentation
```

## Module Responsibilities

### 🌐 Environment (`/environment/`)

**`browserEnv.ts`** (~40 lines)
- Browser-compatible environment variable access
- Handles Docusaurus customFields, window objects, process.env
- Used for build-time configuration

**`detection.ts`** (~30 lines)  
- Development mode detection
- Manual test mode detection
- Environment state management

### 🔍 Discovery (`/discovery/`)

**`portDiscovery.ts`** (~80 lines)
- Local development API port discovery
- Tries multiple ports for API health checks
- Caching and fallback logic

**`branchDetection.ts`** (~80 lines)
- Branch name cleaning and parsing
- Firebase deployment pattern matching
- API URL generation and testing utilities

**`urlResolution.ts`** (~110 lines)
- Main API URL resolution orchestration
- Environment variable priority handling
- Branch deployment discovery coordination

### 🌐 Client (`/client/`)

**`axiosClient.ts`** (~60 lines)
- Axios HTTP client configuration
- Request/response interceptors
- Dynamic base URL handling

## Usage Examples

### Basic API Client
```typescript
import apiClient from './components/api/Core';

// The client automatically discovers the correct API endpoint
const response = await apiClient.get('/api/github/pull-requests');
```

### Environment Detection
```typescript
import { isDevelopment, isManualTestMode } from './components/api/Core';

if (isDevelopment()) {
  console.log('Running in development mode');
}
```

### Manual API URL Resolution
```typescript
import { getApiBaseUrl } from './components/api/Core';

const apiUrl = await getApiBaseUrl();
console.log('Using API:', apiUrl);
```

### Environment Variables
```typescript
import { getBrowserEnv } from './components/api/Core';

const customApiUrl = getBrowserEnv('REACT_APP_API_BASE_URL');
```

## Key Features

### 🎯 **Automatic API Discovery**
- **Development**: Discovers local API ports (3005, 3015, etc.)
- **Branch Deployments**: Finds Cloud Run URLs from environment variables
- **Production**: Falls back to main production API

### 🔧 **Environment Variable Support**
- Docusaurus `customFields` (build-time)
- `window.__ENV__` (runtime injection)
- `process.env` (Node.js environments)
- `import.meta.env` (Vite/modern bundlers)

### 🌿 **Branch Deployment Intelligence**
- Detects Firebase branch deployment URLs
- Parses PR numbers and branch hashes
- Tests multiple API URL patterns (.a.run.app, .us-central1.run.app)
- Systematic fallback search for API endpoints

### 📡 **HTTP Client Features**
- 30-second timeout for GitHub API calls
- Automatic base URL resolution
- Common error handling and retry logic
- Request/response interceptors for debugging

## Configuration Priority

1. **Test Override**: `window.__TEST_API_URL__`
2. **Environment Variables**: `REACT_APP_API_BASE_URL`, `DOCUSAURUS_API_BASE_URL`
3. **Branch Deployment**: Firebase hostname parsing + API discovery
4. **Development**: Local port discovery (3005, 3015, etc.)
5. **Production**: Default production API URL

## Branch Deployment Flow

1. **Detect Branch Deployment**: Parse Firebase URL pattern
2. **Extract PR Info**: Get PR number and deployment hash
3. **Generate Branch Names**: Clean and generate possible branch names
4. **Test API URLs**: Try different Cloud Run URL patterns
5. **Systematic Search**: Fallback patterns if direct matching fails
6. **Production Fallback**: Use main API if no branch API found

## File Size Goals

Each file is kept **under 120 lines** for maintainability:
- `environment/browserEnv.ts`: ~40 lines
- `environment/detection.ts`: ~30 lines  
- `discovery/portDiscovery.ts`: ~80 lines
- `discovery/branchDetection.ts`: ~80 lines
- `discovery/urlResolution.ts`: ~110 lines
- `client/axiosClient.ts`: ~60 lines
- `Core.ts`: ~30 lines

## Backwards Compatibility

The `Core.ts` file maintains full backwards compatibility by re-exporting all previous functionality. Existing imports will continue to work without changes.

```typescript
// These imports still work exactly as before
import apiClient, { getApiBaseUrl, getApiPort } from './components/api/Core';
``` 