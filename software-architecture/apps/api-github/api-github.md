# apps/api-github - GitHub Integration API

> **GitHub portfolio API** for retrieving and displaying developer pull request history and contributions

## Overview
The GitHub API service provides live access to GitHub data for creating developer portfolios. It focuses on pull request history, contribution analytics, and developer profile information without database storage - all data is retrieved live from GitHub's official API.

## Tech Stack 
- **Express.js** with TypeScript
- **GitHub REST API** for data retrieval
- **Octokit** for GitHub API integration
- **Zod** for validation
- **Winston** for logging
- **Vitest** for unit testing
- **No database** - live API calls only

## Key Features

### Pull Request Portfolio
- **Pull request history** retrieval and formatting
- **Contribution analytics** (commits, reviews, issues)
- **Repository insights** and statistics
- **Filtering and pagination** support

### Developer Profile
- **GitHub profile** data aggregation
- **Activity timeline** generation
- **Skills and languages** analysis from repositories
- **Contribution patterns** and streaks

### Portfolio Export
- **Clean data formatting** for frontend consumption
- **Caching strategies** for API rate limiting
- **Error handling** for GitHub API limitations
- **Configurable user targeting** (default: lmcrean)

## Configuration
- **Configurable GitHub username** for redistribution
- **GitHub Personal Access Token** support
- **Rate limiting** management
- **Caching strategies** for optimal performance

## Deployment
- **Vercel Functions** optimized
- **Environment variables** for GitHub tokens
- **CORS** configured for web app integration
- **TypeScript** first approach for type safety 