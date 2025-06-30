# API Design Specification

## Overview
RESTful API endpoints for AI chat functionality. Designed to be consumed by the apps/web frontend.

## Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://ai-service.your-domain.com/api`

## Authentication
- No authentication required for MVP
- Future: API key or JWT token authentication

## API Endpoints

### Chat Endpoints

#### Send Message
```
POST /chat/message
```

**Request Body**:
```json
{
  "message": "string",           // User's message (required)
  "context"?: "string",          // Optional conversation context
  "options"?: {
    "temperature"?: number,      // AI creativity (0-1, default: 0.7)
    "maxTokens"?: number         // Max response length (default: 1000)
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "string",        // AI response
    "messageId": "string",       // Unique message ID
    "timestamp": "ISO string",   // Response timestamp
    "tokensUsed": number         // Tokens consumed
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "string",           // Error code (INVALID_INPUT, AI_ERROR, etc.)
    "message": "string",        // Human-readable error message
    "details"?: object          // Additional error details
  }
}
```

---

#### Regenerate Response
```
POST /chat/regenerate
```

**Request Body**:
```json
{
  "messageId": "string",        // ID of message to regenerate
  "context"?: "string",         // Optional conversation context
  "options"?: {
    "temperature"?: number,     // Different creativity level
    "maxTokens"?: number
  }
}
```

**Response**: Same as Send Message

---

#### Health Check
```
GET /chat/health
```

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "ISO string",
    "geminiStatus": "connected", // Gemini API connection status
    "uptime": number             // Service uptime in seconds
  }
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_INPUT` | Request validation failed | 400 |
| `MESSAGE_TOO_LONG` | Message exceeds length limit | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `AI_SERVICE_ERROR` | Gemini API error | 502 |
| `AI_SERVICE_TIMEOUT` | Gemini API timeout | 504 |
| `INTERNAL_ERROR` | Server error | 500 |

## Request Validation

### Message Constraints
- **Minimum length**: 1 character
- **Maximum length**: 4000 characters
- **Content**: No harmful/illegal content (basic filtering)

### Rate Limiting
- **Per IP**: 60 requests per minute
- **Per session**: 20 requests per minute
- **Burst**: 10 requests per 10 seconds

## Response Format Standards

### Success Response
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}
```

## CORS Configuration
- **Allowed Origins**: 
  - `http://localhost:3000` (development)
  - `https://your-domain.com` (production)
- **Allowed Methods**: `GET, POST, OPTIONS`
- **Allowed Headers**: `Content-Type, Authorization`

## Integration with apps/web

### Frontend Service Example
```typescript
// In apps/web/src/services/aiService.ts
class AiService {
  private baseUrl = process.env.REACT_APP_AI_API_URL;

  async sendMessage(message: string, context?: string) {
    const response = await fetch(`${this.baseUrl}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });
    return response.json();
  }
}
```

## Monitoring & Logging

### Request Logging
- Log all incoming requests
- Include request ID, IP, endpoint, timestamp
- Log response time and status

### Error Logging
- Detailed error logs for debugging
- Gemini API error tracking
- Rate limiting violations

### Metrics
- Request count per endpoint
- Average response time
- Error rate
- Gemini API usage/costs 