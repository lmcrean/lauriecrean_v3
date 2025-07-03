# Port Configuration for lauriecrean Project

This document defines the port allocation for different testing modes with **automatic port conflict resolution**. If a port is already in use, the system will automatically increment to find the next available port (+1, +2, etc.).

## Dynamic Port Allocation

### Manual Testing Mode
- **Web Service**: `http://localhost:3010` (or 3011, 3012, etc. if 3010 is in use)
- **API Service**: `http://localhost:3005` (or 3006, 3007, etc. if 3005 is in use)
- **Usage**: `npm run dev:manual`
- **Purpose**: For manual development and testing by developers

### End-to-End (E2E) Testing Mode  
- **Web Service**: `http://localhost:3020` (or 3021, 3022, etc. if 3020 is in use)
- **API Service**: `http://localhost:3015` (or 3016, 3017, etc. if 3015 is in use)
- **Usage**: `npm run dev:e2e` or `npm run dev`
- **Purpose**: For automated Playwright tests and CI/CD

## Automatic Port Discovery

### Frontend (Web Service)
- The frontend automatically discovers which API port is actually running
- Tries ports in order: [3005, 3006, 3007...] for manual mode or [3015, 3016, 3017...] for e2e mode
- Uses health check endpoint (`/health`) to verify API availability
- Caches the discovered port for performance

### API Service
- Automatically finds available ports starting from the base port
- Reports the actual port being used in console output
- Provides `/api/port-info` endpoint for service discovery

## Environment Variables

The API service reads port configuration from `apps/api-github/.env`:

```env
GITHUB_TOKEN=your_github_token_here
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

## Benefits of Dynamic Port System

1. **🚫 No Port Conflicts**: Automatically resolves port conflicts by incrementing (+1, +2, etc.)
2. **🔄 Simultaneous Running**: Multiple instances can run without interference
3. **🎯 Smart Discovery**: Frontend automatically finds the correct API port
4. **⚡ Zero Configuration**: Works out of the box without manual port management
5. **🛡️ Resilient**: Handles port conflicts gracefully with clear error messages
6. **📊 Transparent**: Shows which ports are actually being used in console output
7. **🔍 Self-Healing**: If a service restarts on a different port, frontend will rediscover it

## Example Scenarios

### Scenario 1: Normal Startup
```bash
npm run dev:manual
# ✅ Web starts on 3010, API starts on 3005
# 🔗 Frontend connects to API on 3005
```

### Scenario 2: Port 3005 Already in Use
```bash
npm run dev:manual
# 🔄 Port 3005 was in use, using port 3006 instead
# ✅ Web starts on 3010, API starts on 3006
# 🔍 Frontend discovers API on 3006 automatically
```

### Scenario 3: Multiple Instances
```bash
# Terminal 1
npm run dev:manual
# ✅ Web: 3010, API: 3005

# Terminal 2  
npm run dev:e2e
# ✅ Web: 3020, API: 3015

# Terminal 3
npm run dev:manual
# 🔄 Ports in use, using Web: 3011, API: 3006
``` 