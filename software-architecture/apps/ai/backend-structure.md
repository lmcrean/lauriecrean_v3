# AI Backend Service Structure

## Overview
Express.js service with TypeScript for AI chat functionality. Handles Gemini AI integration and provides RESTful endpoints for apps/web frontend.

## Directory Structure

```
apps/ai/
├── src/
│   ├── controllers/
│   │   ├── chatController.ts              # Chat API endpoints
│   │   └── healthController.ts            # Health check endpoints
│   ├── services/
│   │   ├── geminiService.ts               # Gemini AI integration
│   │   ├── messageService.ts              # Message processing logic
│   │   └── validationService.ts           # Input validation
│   ├── middleware/
│   │   ├── cors.ts                        # CORS configuration
│   │   ├── errorHandler.ts                # Global error handling
│   │   ├── rateLimiter.ts                 # Rate limiting
│   │   └── logger.ts                      # Request logging
│   ├── routes/
│   │   ├── chat.ts                        # Chat-related routes
│   │   ├── health.ts                      # Health check routes
│   │   └── index.ts                       # Route aggregator
│   ├── types/
│   │   ├── chat.ts                        # Chat type definitions
│   │   ├── api.ts                         # API response types
│   │   └── gemini.ts                      # Gemini API types
│   ├── utils/
│   │   ├── logger.ts                      # Logging utilities
│   │   ├── config.ts                      # Configuration management
│   │   ├── validation.ts                  # Validation helpers
│   │   └── constants.ts                   # Backend constants
│   ├── config/
│   │   ├── database.ts                    # DB config (future use)
│   │   ├── gemini.ts                      # Gemini API configuration
│   │   └── server.ts                      # Server configuration
│   ├── tests/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── app.ts                            # Express app setup
│   └── server.ts                         # Server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── jest.config.js
```

## API Routes

### Chat Routes (`/api/chat`)
```
POST   /message      # Send message to AI
POST   /regenerate   # Regenerate last response
GET    /health       # Chat service health check
```

## Core Services

### GeminiService
- Initialize Gemini AI client
- Send messages to Gemini
- Handle API responses and errors
- Configure AI parameters (temperature, tokens, etc.)

### MessageService
- Process user messages
- Format AI responses
- Handle message validation
- Manage conversation context

### ValidationService
- Validate incoming requests
- Sanitize user input
- Check message length limits
- Rate limiting validation

## Middleware Stack
1. **CORS** - Cross-origin request handling
2. **Logger** - Request/response logging
3. **Rate Limiter** - Prevent API abuse
4. **Error Handler** - Centralized error handling
5. **JSON Parser** - Parse request bodies

## Environment Variables
```
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
```

## Error Handling
- Centralized error middleware
- Consistent error response format
- Logging for debugging
- Graceful degradation for AI failures

## Security Features
- Rate limiting per IP
- Input validation and sanitization
- CORS configuration
- Environment variable protection 