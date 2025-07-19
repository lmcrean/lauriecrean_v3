# Deployment Configuration

## Deployment Targets
- **Web Application**: Vercel (apps/web/)
- **API Service**: Vercel Serverless Functions (apps/api/github/)
- **CI/CD**: GitHub Actions with automated testing pipeline
- **E2E Testing**: Automated against deployed services using environment variables

## Vercel Configuration

### Web Application (apps/web/)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "docusaurus"
}
```

### API Service (apps/api/github/)
```json
{
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/src/index.ts"
    }
  ]
}
```

## Environment Variables

### Required for API Deployment
```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
```

### Required for E2E Testing
```bash
WEB_DEPLOYMENT_URL=https://your-portfolio.vercel.app
API_DEPLOYMENT_URL=https://your-api.vercel.app
```

## Deployment Workflow

1. **Development**: Local development on feature branches
2. **Pull Request**: Automatic preview deployments on Vercel
3. **Main Branch**: Production deployment to stable URLs
4. **Testing**: E2E tests run against deployed services

## Manual Deployment Commands

### Web Application
```bash
cd apps/web
npm run deploy:prod
```

### API Service
```bash
cd apps/api/github
npm run deploy
```

## Monitoring and Health Checks

- **API Health**: `/api/health` endpoint for service monitoring
- **Web Performance**: Vercel analytics and Core Web Vitals
- **Error Tracking**: Built-in error handling and logging
- **Uptime Monitoring**: Automated health checks in CI/CD pipeline