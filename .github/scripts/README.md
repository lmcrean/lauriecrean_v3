# Issue Triage GitHub Actions Workflow

This GitHub Actions workflow automatically triages issues using Gemini AI to suggest and apply appropriate labels.

## Features

- **Automated Scheduling**: Runs every 10 minutes to process new unlabeled issues
- **AI-Powered Analysis**: Uses Gemini AI to analyze issue content and suggest relevant labels
- **GitHub API Integration**: Fetches repository labels and applies suggested labels to issues
- **Manual Trigger**: Can be triggered manually via GitHub Actions UI

## Setup

### Required Secrets

Add these secrets to your GitHub repository settings:

1. **GITHUB_TOKEN**: Automatically provided by GitHub Actions (no setup needed)
2. **GEMINI_API_KEY**: Your Google Gemini API key
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Add it to repository secrets in Settings > Secrets and variables > Actions

### Configuration

The workflow can be customized by modifying `.github/workflows/issue-triage.yml`:

- **Schedule**: Change the cron expression to run at different intervals
- **Node.js Version**: Update the Node.js version if needed
- **Processing Limits**: Modify the script to process different numbers of issues

## How It Works

1. **Label Fetching**: Retrieves all available labels from the repository
2. **Issue Discovery**: Finds all open issues without any labels
3. **AI Analysis**: Uses Gemini AI to analyze issue title and body content
4. **Label Suggestion**: AI suggests 1-3 most appropriate labels from available options
5. **Label Application**: Applies the suggested labels to the issue

## Script Details

The main script (`issue-triage.js`) includes:

- **Error handling** for API failures
- **Rate limiting** with delays between API calls
- **Validation** to ensure only existing labels are applied
- **Detailed logging** for monitoring and debugging

## Monitoring

Check the GitHub Actions tab to monitor workflow runs and see processing logs for each issue triage session.