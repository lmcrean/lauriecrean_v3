# Complete File Structure Summary

## Overview
This document shows the complete file and folder structure for the `apps/ai` Express.js backend service.

## Full Directory Structure

```
apps/ai/
├── src/
│   ├── controllers/
│   │   ├── chatController.ts              # Chat endpoints (/message, /regenerate)
│   │   └── healthController.ts            # Health check endpoint
│   │
│   ├── services/
│   │   ├── geminiService.ts               # Gemini AI integration
│   │   ├── messageService.ts              # Message processing logic
│   │   └── validationService.ts           # Input validation
│   │
│   ├── middleware/
│   │   ├── cors.ts                        # CORS configuration
│   │   ├── errorHandler.ts                # Global error handling
│   │   ├── rateLimiter.ts                 # Rate limiting
│   │   └── requestLogger.ts               # Request logging
│   │
│   ├── routes/
│   │   ├── chat.ts                        # Chat route definitions
│   │   ├── health.ts                      # Health route definitions
│   │   └── index.ts                       # Route aggregator
│   │
│   ├── types/
│   │   ├── chat.ts                        # Chat-related interfaces
│   │   ├── api.ts                         # API response types
│   │   ├── gemini.ts                      # Gemini API types
│   │   └── common.ts                      # Common type definitions
│   │
│   ├── utils/
│   │   ├── logger.ts                      # Winston logger setup
│   │   ├── config.ts                      # Configuration management
│   │   ├── validation.ts                  # Validation helpers
│   │   ├── constants.ts                   # Application constants
│   │   └── responseBuilder.ts             # Standard response formatting
│   │
│   ├── config/
│   │   ├── gemini.ts                      # Gemini API configuration
│   │   ├── server.ts                      # Server configuration
│   │   └── environment.ts                 # Environment variable handling
│   │
│   ├── app.ts                            # Express app setup
│   └── server.ts                         # Server entry point
│
├── tests/
│   ├── controllers/
│   │   ├── chatController.test.ts
│   │   └── healthController.test.ts
│   ├── services/
│   │   ├── geminiService.test.ts
│   │   ├── messageService.test.ts
│   │   └── validationService.test.ts
│   ├── middleware/
│   │   ├── errorHandler.test.ts
│   │   └── rateLimiter.test.ts
│   ├── utils/
│   │   └── validation.test.ts
│   ├── integration/
│   │   ├── chat.integration.test.ts
│   │   └── health.integration.test.ts
│   └── setup/
│       ├── testSetup.ts
│       └── mockData.ts
│
├── dist/                                 # Compiled JavaScript (build output)
├── logs/                                 # Log files (gitignored)
├── node_modules/                         # Dependencies (gitignored)
│
├── .env                                  # Environment variables (gitignored)
├── .env.example                          # Environment template
├── .gitignore                           # Git ignore rules
├── .eslintrc.js                         # ESLint configuration
├── .prettierrc                          # Prettier configuration
├── jest.config.js                       # Jest test configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Locked dependencies
├── README.md                            # Project documentation
├── Dockerfile                           # Docker configuration
├── docker-compose.yml                   # Docker Compose setup
└── vercel.json                          # Vercel deployment config
```

## Key Files Breakdown

### Core Application Files
- **`src/server.ts`** - Main entry point, starts the Express server
- **`src/app.ts`** - Express application setup, middleware configuration
- **`package.json`** - Dependencies, scripts, project metadata

### API Layer
- **`src/controllers/`** - Handle HTTP requests/responses
- **`src/routes/`** - Define API endpoints and route handlers
- **`src/middleware/`** - Express middleware for cross-cutting concerns

### Business Logic
- **`src/services/`** - Core business logic and external integrations
- **`src/utils/`** - Helper functions and utilities
- **`src/config/`** - Configuration management

### Data & Types
- **`src/types/`** - TypeScript type definitions
- No database models (stateless service)

### Development & Deployment
- **`tests/`** - Unit and integration tests
- **Configuration files** - TypeScript, ESLint, Jest configs
- **`vercel.json`** - Vercel serverless deployment config (primary deployment method)
- **Docker files** - Alternative containerization setup

## Environment Files

### `.env.example`
```bash
# Required
NODE_ENV=development
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
GEMINI_MODEL=gemini-1.5-flash
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=60
LOG_LEVEL=info
```

### `.gitignore`
```
# Dependencies
node_modules/

# Build output
dist/

# Environment
.env
.env.local

# Logs
logs/
*.log

# Runtime
.DS_Store
*.pid
*.seed
*.lock

# IDE
.vscode/
.idea/

# Testing
coverage/
```

## Scripts in package.json

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "deploy": "vercel",
    "deploy:prod": "vercel --prod",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "type-check": "tsc --noEmit"
  }
}
```

## Integration Points

### With apps/web
- **API Base URL**: 
  - Development: `http://localhost:3001/api` 
  - Production: `https://ai-[project-name].vercel.app/api`
- **CORS Origin**: Must allow apps/web domain (configured for Vercel deployment)
- **Frontend Service**: Create `aiService.ts` in apps/web

### External Services
- **Gemini API**: Google's AI service
- **Logging**: Winston for structured logging
- **Monitoring**: Health checks and metrics

## Development & Deployment Workflow

### Local Development
1. **Setup**: `npm install && cp .env.example .env`
2. **Development**: `npm run dev` (with hot reload)
3. **Testing**: `npm test` or `npm run test:watch`
4. **Building**: `npm run build`

### Vercel Deployment (Primary)
1. **Deploy**: `vercel` (from project root)
2. **Environment**: Set environment variables in Vercel dashboard
3. **Auto-deploy**: Connected to Git for automatic deployments
4. **Production URL**: `https://ai-[project-name].vercel.app/api`

### Alternative: Local Production
- **Production**: `npm start` (for testing production build locally)

## Vercel Configuration

The `vercel.json` file configures serverless deployment:
- **Runtime**: Node.js serverless functions
- **Entry Point**: `src/server.ts`
- **API Routes**: All `/api/*` routes handled by the Express app
- **Environment**: Production environment variables

This structure provides a clean, scalable backend service focused solely on AI functionality that integrates seamlessly with the existing apps/web frontend and deploys effortlessly to Vercel's serverless platform. 