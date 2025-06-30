# Gemini AI Integration

## Overview
Integration with Google's Gemini AI API for chat functionality. Handles message processing, context management, and response generation.

## Gemini Setup

### API Key Configuration
```bash
# Environment variable
GEMINI_API_KEY=your_gemini_api_key_here

# Or in .env file
echo "GEMINI_API_KEY=your_key" >> .env
```

### Model Selection
- **Primary**: `gemini-1.5-flash` (fast responses, good for chat)
- **Fallback**: `gemini-1.5-pro` (higher quality, slower)
- **Configuration**: Environment variable `GEMINI_MODEL`

## Service Architecture

### GeminiService Class Structure
```
services/geminiService.ts
├── initialize()              # Setup Gemini client
├── sendMessage()            # Send user message to AI
├── generateResponse()       # Process AI response
├── handleContext()          # Manage conversation context
├── validateInput()          # Input validation
├── handleErrors()           # Error handling
└── getUsageStats()          # Token usage tracking
```

## Configuration Options

### AI Parameters
```typescript
interface GeminiConfig {
  model: string;              // Model name (gemini-1.5-flash)
  temperature: number;        // Creativity (0-1, default: 0.7)
  maxOutputTokens: number;    // Max response length (default: 1000)
  topP: number;              // Nucleus sampling (default: 0.8)
  topK: number;              // Top-K sampling (default: 40)
  safetySettings: SafetySetting[];
}
```

### Safety Settings
```typescript
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // Additional safety configurations...
];
```

## Context Management

### Conversation Context
- **Session-based**: No persistent storage
- **Context Window**: Last 10 messages for context
- **Context Format**: Structured conversation history

### Context Structure
```typescript
interface ConversationContext {
  messages: Array<{
    role: 'user' | 'model';
    parts: [{ text: string }];
    timestamp: string;
  }>;
  metadata: {
    conversationId: string;
    startTime: string;
    messageCount: number;
  };
}
```

## Message Processing Flow

### 1. Input Validation
- Check message length (1-4000 chars)
- Content filtering for harmful content
- Rate limiting validation

### 2. Context Preparation
- Retrieve recent conversation history
- Format context for Gemini API
- Add system instructions if needed

### 3. Gemini API Call
- Send formatted request to Gemini
- Handle streaming responses (future)
- Process safety filters

### 4. Response Processing
- Extract AI response text
- Format for frontend consumption
- Log usage statistics

### 5. Error Handling
- Catch and categorize errors
- Implement retry logic
- Fallback to different model if needed

## Error Handling

### Common Error Types
```typescript
enum GeminiErrorType {
  API_KEY_INVALID = 'API_KEY_INVALID',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CONTENT_FILTERED = 'CONTENT_FILTERED',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED'
}
```

### Retry Strategy
- **API Errors**: 3 retries with exponential backoff
- **Rate Limits**: Respect retry-after headers
- **Timeouts**: 30-second timeout, 2 retries
- **Content Filters**: No retry, return error to user

## Performance Optimization

### Response Caching
- Cache common responses (limited implementation)
- Cache for identical messages within 5 minutes
- Clear cache on restart

### Request Optimization
- Minimize context sent to API
- Compress large contexts
- Batch multiple messages if possible

### Token Management
- Track token usage per request
- Implement token-based rate limiting
- Monitor monthly quota usage

## Security Considerations

### Input Sanitization
- Remove potential injection attempts
- Validate message encoding
- Limit special characters

### API Key Security
- Never log API keys
- Use environment variables only
- Rotate keys regularly

### Content Filtering
- Implement additional content filters
- Log filtered content for review
- Block repeat offenders (IP-based)

## Monitoring & Analytics

### Key Metrics
- Response time per request
- Token usage per day/month
- Error rate by type
- Popular message patterns

### Logging Strategy
```typescript
interface GeminiLogEntry {
  requestId: string;
  timestamp: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  responseTime: number;
  success: boolean;
  errorType?: string;
}
```

### Cost Tracking
- Track token usage costs
- Set monthly spending limits
- Alert on unusual usage patterns

## Future Enhancements

### Planned Features
- **Streaming Responses**: Real-time response chunks
- **Function Calling**: Allow AI to use tools/APIs
- **Image Support**: Process images in messages
- **Custom Instructions**: User-specific AI behavior
- **Conversation Memory**: Cross-session context

### Model Upgrades
- Support for newer Gemini versions
- A/B testing different models
- Dynamic model selection based on query type 