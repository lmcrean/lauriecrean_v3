# AI Backend Service Architecture

## Overview
Express.js backend service for handling AI chat functionality using Gemini API integration. Provides RESTful endpoints for the frontend (integrated into apps/web).

## Tech Stack
- **Backend**: Express.js + TypeScript  
- **AI Service**: Google Gemini API
- **Storage**: Stateless (no database)
- **Frontend**: Integrated into apps/web

## Key Features
- Gemini AI message processing
- RESTful API endpoints
- Error handling & retry logic
- Rate limiting and security
- CORS configuration for apps/web
- Request validation

## Architecture Overview

```
apps/ai/                     # Express.js AI backend service
├── src/
│   ├── controllers/         # API route handlers
│   ├── services/            # Business logic (Gemini integration)
│   ├── middleware/          # Express middleware
│   ├── routes/              # API route definitions
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── config/              # Configuration files
├── tests/                   # Test files
└── package.json
```

## API Endpoints
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/health` - Health check
- `POST /api/chat/regenerate` - Regenerate AI response

## Service Strategy
- **Stateless**: No persistent storage, each request independent
- **Frontend Integration**: Works with apps/web via API calls
- **AI Processing**: Handles all Gemini API communication

## Documentation Files
- `backend-structure.md` - Express backend file organization
- `api-design.md` - API endpoint specifications
- `gemini-integration.md` - Gemini AI service integration
- `deployment.md` - Deployment and environment setup 