# Project Structure

```
apps/
├── api/                    # C# ASP.NET Core API
│   ├── Controllers/        # API controllers
│   ├── Models/            # Data models
│   ├── Middleware/        # Custom middleware
│   ├── Properties/        # Launch settings
│   └── Dockerfile         # Multi-stage build with package references
└── web/                   # Angular frontend
    ├── src/app/
    │   ├── components/    # Angular components
    │   ├── services/      # HTTP services
    │   └── environments/ # Environment configs
    └── firebase.json      # Firebase hosting

packages/
└── observability/
    └── csharp/            # Shared observability package
        ├── Extensions/    # DI and middleware extensions
        ├── Models/        # Logging models
        └── Services/      # Observability services

integration-tests/
├── api/                   # C# API integration tests
│   ├── Tests/            # xUnit test classes
│   ├── Fixtures/         # Test setup and utilities
│   └── IntegrationTests.csproj
└── web/                  # Angular integration tests
    ├── src/              # Vitest test files
    └── vitest.config.ts  # Test configuration

e2e/                      # Playwright E2E tests
├── tests/                # Test scenarios
├── fixtures/             # Test data with environment-aware URLs
├── utils/                # Test helpers and global setup
├── playwright.config.api.local.ts           # API-only local tests
├── playwright.config.api.production.branch.ts  # API-only branch tests
├── playwright.config.api.production.main.ts    # API-only main tests
├── playwright.config.web.local.ts           # Full web+API local tests
├── playwright.config.web.production.branch.ts  # Full web+API branch tests
├── playwright.config.web.production.main.ts    # Full web+API main tests
├── global-setup.api.local.ts               # API service health check (local)
├── global-setup.api.production.branch.ts   # API service health check (branch)
├── global-setup.api.production.main.ts     # API service health check (main)
├── global-setup.web.local.ts               # Both services health check (local)
├── global-setup.web.production.branch.ts   # Both services health check (branch)
└── global-setup.web.production.main.ts     # Both services health check (main)

docs/                     # Project documentation
├── README.md            # Documentation index
├── overview.md          # Project status and architecture
├── testing.md           # Testing strategy and configurations
├── structure.md         # This file - codebase organization
├── development.md       # Development commands and workflows
└── deployment.md        # Deployment configuration
```