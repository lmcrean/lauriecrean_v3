# GitHub Actions Workflows

## Workflow Architecture

The project uses GitHub Actions for continuous integration and deployment, with separate workflows for different components and environments.

## Current Workflows

### Deployment Workflows
- **deploy-web.yml**: Deploys the portfolio website to Vercel
- **deploy-api.yml**: Deploys the GitHub API service to Vercel

### Testing Workflows
- **test-e2e.yml**: Runs Playwright end-to-end tests
- **test-integration.yml**: Runs Vitest integration tests
- **test-unit.yml**: Runs Jest unit tests

## Workflow Triggers

### Pull Request Workflows
**Purpose**: Validate changes before merging to main branch

**Triggered on**: Pull requests to main branch

**Actions**:
- Run unit tests for web and API components
- Run integration tests for cross-component validation
- Run E2E tests against preview deployments
- Deploy preview environments for manual testing

### Main Branch Workflows
**Purpose**: Deploy to production and validate deployment

**Triggered on**: Pushes to main branch

**Actions**:
- Deploy web application to production Vercel
- Deploy API service to production Vercel
- Run comprehensive E2E tests against production
- Monitor deployment health and performance

## Workflow Details

### deploy-web.yml
```yaml
name: Deploy Web Application
triggers: 
  - push to main
  - pull_request to main
steps:
  - Build Docusaurus site
  - Deploy to Vercel
  - Run health checks
```

### deploy-api.yml
```yaml
name: Deploy API Service
triggers:
  - push to main
  - pull_request to main
steps:
  - Build Node.js TypeScript
  - Deploy to Vercel Functions
  - Validate API endpoints
```

### test-e2e.yml
```yaml
name: End-to-End Tests
triggers:
  - pull_request to main
  - deployment_status
steps:
  - Install Playwright
  - Run API health tests
  - Run full web application tests
  - Generate test reports
```

## Environment Variables

### Required for All Workflows
```bash
# GitHub API access
GITHUB_TOKEN=personal_access_token
GITHUB_USERNAME=github_username

# Deployment URLs for E2E testing
WEB_DEPLOYMENT_URL=portfolio_website_url
API_DEPLOYMENT_URL=api_service_url

# Vercel deployment tokens
VERCEL_TOKEN=vercel_deployment_token
VERCEL_ORG_ID=vercel_organization_id
VERCEL_PROJECT_ID=vercel_project_id
```

### Workflow-Specific Variables

**Pull Request Workflows**:
- `VERCEL_PREVIEW_URL` - Preview deployment URL
- `PR_NUMBER` - Pull request identifier
- `BRANCH_NAME` - Source branch name

**Production Workflows**:
- `PRODUCTION_WEB_URL` - Stable production website URL
- `PRODUCTION_API_URL` - Stable production API URL
- `GITHUB_SHA` - Commit hash for release tracking

## Monitoring and Notifications

- **Deployment Status**: Automatic status updates on pull requests
- **Test Results**: Detailed test reports with screenshots for failures
- **Performance Metrics**: Core Web Vitals and API response times
- **Error Alerts**: Notifications for deployment or test failures