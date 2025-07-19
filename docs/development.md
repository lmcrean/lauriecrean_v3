# Development Guide

## Development Commands

### Web Application (apps/web/)
```bash
npm start           # Start Docusaurus development server (port 3020)
npm run build       # Build for production
npm run typecheck   # Run TypeScript checks
npm test            # Run Jest unit tests
npm run test:e2e    # Run Playwright E2E tests
npm run deploy:prod # Deploy to Vercel
```

### API Application (apps/api/github/)
```bash
npm run dev         # Start development server (port 3015)
npm run dev:e2e     # Start server for E2E tests
npm run build       # Build TypeScript
npm run deploy      # Deploy to Vercel
```

### E2E Tests (e2e/)
```bash
npm test                    # Run all E2E tests
npm run test:headed        # Run tests with browser UI
npm run dev:e2e            # Start both web and API services
npm run test:api:health    # Test API health endpoint
npm run test:web:pr-feed   # Test pull request feed
```

### Integration Tests (integration/)
```bash
npm test            # Run Vitest integration tests
npm run test:ui     # Run with Vitest UI
npm run test:coverage # Run with coverage report
```

## Environment Setup

### Required Environment Variables
```bash
# For GitHub API integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
```

### Development Workflow
1. **Start API**: `cd apps/api/github && npm run dev`
2. **Start Web**: `cd apps/web && npm start`
3. **Run Tests**: `cd e2e && npm test`

### Port Configuration
- **Web Development**: http://localhost:3020
- **API Development**: http://localhost:3015
- **E2E Tests**: Uses ports 3020 (web) and 3015 (API)

### TypeScript Checking
Run type checking across the entire project:
```bash
# Web application
cd apps/web && npm run typecheck

# API application  
cd apps/api/github && npm run build
```