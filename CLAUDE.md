# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo portfolio project with the following key applications:

- **apps/web/** - Docusaurus-based portfolio website with React components
- **apps/api/github/** - Node.js Express API for GitHub pull request data
- **e2e/** - End-to-end tests using Playwright
- **integration/** - Integration tests using Vitest
- **shared/types/** - Shared TypeScript types across applications

## Development Commands

### Web Application (apps/web/)
```bash
npm start           # Start development server
npm run build       # Build for production
npm run typecheck   # Run TypeScript checks
npm test            # Run Jest unit tests
npm run test:e2e    # Run Playwright E2E tests
npm run deploy:prod # Deploy to Vercel
```

### API Application (apps/api/github/)
```bash
npm run dev         # Start development server
npm run dev:e2e     # Start server for E2E tests (port 3015)
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

## Key Architecture

### Pull Request Feed System
- **API**: `/apps/api/github/src/pull-requests/` - GitHub API integration with caching
- **Web Components**: `/apps/web/src/components/pull-request-feed/` - React components for displaying PRs
- **Shared Types**: `/shared/types/pull-requests/` - TypeScript interfaces used across apps

### Testing Strategy
- **Unit Tests**: Jest with React Testing Library (apps/web/)
- **Integration Tests**: Vitest for component integration (integration/)
- **E2E Tests**: Playwright for full system testing (e2e/)

### Environment Configuration
- Web app uses Docusaurus environment variables
- API requires `GITHUB_TOKEN` and `GITHUB_USERNAME`
- E2E tests use different ports: web (3020), API (3015)

## Important Notes

### Directory Navigation
Be mindful of running npm commands in the correct folder. Each app has its own package.json.

### Port Configuration
- Web development: Port 3020
- API development: Port 3015 (for E2E compatibility)
- Production API: Deployed on Vercel

### Build Process
The web app uses Docusaurus with custom React components, Tailwind CSS, and Splide.js for carousels.