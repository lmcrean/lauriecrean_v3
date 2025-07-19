# Project Structure

```
apps/
├── api/
│   └── github/             # Node.js Express API for GitHub data
│       ├── src/
│       │   ├── pull-requests/  # GitHub API integration with caching
│       │   ├── health/         # Health check endpoints
│       │   └── index.ts        # Express server configuration
│       ├── package.json        # API dependencies
│       └── vercel.json         # Vercel deployment config
└── web/                    # Docusaurus portfolio website
    ├── src/
    │   ├── components/
    │   │   └── pull-request-feed/  # React components for PR display
    │   ├── pages/              # Docusaurus pages
    │   └── css/                # Custom styles and Tailwind
    ├── docusaurus.config.js    # Docusaurus configuration
    ├── package.json            # Web dependencies
    └── vercel.json             # Vercel deployment config

shared/
└── types/
    └── pull-requests/          # TypeScript interfaces for PR data
        ├── index.ts            # Main type definitions
        └── api.ts              # API response types

integration/                    # Integration tests using Vitest
├── src/
│   ├── api/                    # API integration tests
│   ├── web/                    # Web component integration tests
│   └── utils/                  # Test utilities and fixtures
├── vitest.config.ts            # Vitest configuration
└── package.json                # Integration test dependencies

e2e/                           # Playwright E2E tests
├── tests/
│   ├── api/                   # API endpoint tests
│   └── web/                   # Full web application tests
├── fixtures/                  # Test data and utilities
├── playwright.config.ts       # Playwright configuration
└── package.json               # E2E test dependencies

docs/                          # Project documentation
├── README.md                  # Documentation index
├── overview.md                # Project status and architecture
├── testing.md                 # Testing strategy and configurations
├── structure.md               # This file - codebase organization
├── development.md             # Development commands and workflows
├── deployment.md              # Deployment configuration
└── workflows.md               # GitHub Actions workflow documentation

.github/
└── workflows/                 # GitHub Actions CI/CD
    ├── deploy-api.yml         # API deployment workflow
    ├── deploy-web.yml         # Web deployment workflow
    └── test-e2e.yml           # E2E testing workflow
```