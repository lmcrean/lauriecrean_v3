# Deployment & Environment Setup

## Overview
Deployment configuration for the AI backend service. Designed to run as a standalone Express.js service that can be deployed independently from apps/web.

## Environment Configuration

### Required Environment Variables
```bash
# Core Configuration
NODE_ENV=production
PORT=3001

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
# For multiple origins: CORS_ORIGIN=https://domain1.com,https://domain2.com

# Rate Limiting
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=60000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Optional Environment Variables
```bash
# AI Configuration
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=1000
GEMINI_TIMEOUT=30000

# Security
API_KEY_REQUIRED=false
CONTENT_FILTER_ENABLED=true

# Monitoring
ENABLE_METRICS=true
HEALTH_CHECK_INTERVAL=30000
```

## Development Setup

### Local Development
```bash
# 1. Clone and navigate
cd apps/ai

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your Gemini API key

# 4. Start development server
npm run dev

# 5. Test the service
curl http://localhost:3001/api/chat/health
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
```

## Production Deployment

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/chat/health || exit 1

# Start service
CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  ai-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CORS_ORIGIN=${CORS_ORIGIN}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/chat/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Vercel Deployment
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Railway Deployment
```toml
# railway.toml
[build]
  builder = "NIXPACKS"
  buildCommand = "npm run build"

[deploy]
  startCommand = "npm start"
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10

[env]
  NODE_ENV = "production"
  PORT = { default = "3001" }
```

## Environment-Specific Configurations

### Development
- Hot reloading with nodemon
- Detailed error messages
- CORS allowing localhost origins
- Verbose logging

### Staging
- Production build
- Limited CORS origins
- Error logging without sensitive data
- Performance monitoring

### Production
- Optimized build
- Strict CORS policy
- Minimal logging
- Rate limiting enabled
- Health checks configured

## Monitoring & Health Checks

### Health Check Endpoint
```typescript
// Health check response
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "uptime": 3600,
    "geminiStatus": "connected",
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### Monitoring Metrics
- Request rate and response times
- Error rates by endpoint
- Gemini API response times
- Memory and CPU usage
- Token usage and costs

### Logging Configuration
```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});
```

## Scaling Considerations

### Horizontal Scaling
- Stateless service design enables easy scaling
- Load balancer configuration for multiple instances
- Container orchestration with Kubernetes

### Performance Optimization
- Response caching for identical requests
- Connection pooling for external APIs
- Request queuing for high traffic

### Cost Management
- Monitor Gemini API usage and costs
- Implement spending limits
- Cache frequent responses

## Security Configuration

### HTTPS Configuration
```typescript
// SSL/TLS in production
const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(options, app);
```

### Security Headers
```typescript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
```

### API Security
- Rate limiting per IP address
- Request size limits
- Input validation and sanitization
- CORS policy enforcement

## Backup & Recovery

### Configuration Backup
- Environment variables in secure storage
- API keys in secret management system
- Deployment configurations in version control

### Service Recovery
- Automated restart policies
- Health check failure handling
- Rollback procedures for failed deployments

## Integration with apps/web

### Frontend Configuration
```typescript
// In apps/web environment
REACT_APP_AI_API_URL=http://localhost:3001/api  // Development
REACT_APP_AI_API_URL=https://ai-api.domain.com/api  // Production
```

### Network Configuration
- Ensure apps/web can reach apps/ai service
- Configure firewalls and security groups
- Set up internal DNS if needed 