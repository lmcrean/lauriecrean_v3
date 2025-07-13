# GitHub API - Pull Request Portfolio

Simple API for fetching GitHub pull request history for portfolio display.

## Setup

1. **Install dependencies:**
   ```bash
   cd apps/api-github
   npm install
   ```

2. **Set environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Add your GitHub personal access token
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_USERNAME=lmcrean
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

## API Endpoint

### GET `/api/github/pull-requests`

**Query Parameters:**
- `username` (optional): GitHub username (default: lmcrean)
- `limit` (optional): Number of PRs to return (default: 20, max: 50)

**Example:**
```bash
curl "http://localhost:3001/api/github/pull-requests?username=lmcrean&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": 123456,
      "title": "Add TypeScript support",
      "created_at": "2024-01-15T10:30:00Z",
      "merged_at": "2024-01-16T14:20:00Z",
      "html_url": "https://github.com/lmcrean/project/pull/1",
      "state": "merged",
      "repository": {
        "name": "project",
        "description": "A sample project",
        "language": "TypeScript",
        "html_url": "https://github.com/lmcrean/project"
      }
    }
  ],
  "meta": {
    "username": "lmcrean",
    "count": 1
  }
}
```

## Environment Variables

Set these in Vercel dashboard or `.env` file:

- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_USERNAME`: Default username (lmcrean)
- `ALLOWED_ORIGINS`: Comma-separated CORS origins

## Deployment

The API is configured for Vercel deployment with:
- Automatic TypeScript compilation
- Environment variable support
- CORS configuration
- 15-minute response caching

## Rate Limits

- GitHub API: 5,000 requests/hour (with token)
- Vercel Functions: Well within hobby plan limits
- Response caching reduces API calls 