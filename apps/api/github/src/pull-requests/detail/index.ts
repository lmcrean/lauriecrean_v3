import { Octokit } from '@octokit/rest';
import { DetailedPullRequestResponse } from '../../types';
import { retryApiCall, ensureSufficientRateLimit } from '../../utils/rateLimitUtils';
import { validatePullRequestParams, formatPRStats } from './helpers';

/**
 * Fetch detailed information for a specific pull request
 * Includes additional data like commits, additions, deletions, and comments count
 */
export async function fetchPullRequestDetails(
  octokit: Octokit,
  owner: string, 
  repo: string, 
  pullNumber: number
): Promise<DetailedPullRequestResponse> {
  console.log(`🔍 Fetching PR #${pullNumber} from ${owner}/${repo}`);
  
  // Validate parameters
  validatePullRequestParams(owner, repo, pullNumber);
  
  // Check if we have sufficient rate limit for this operation
  const hasRateLimit = await ensureSufficientRateLimit(octokit, 'pull_request_details');
  if (!hasRateLimit) {
    throw new Error('Insufficient GitHub API rate limit for pull request details operation');
  }
  
  // Fetch PR details and comments count in parallel for better performance with retry logic
  const [prResponse, commentsResponse] = await Promise.all([
    retryApiCall(() =>
      octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      })
    ),
    retryApiCall(() =>
      octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: pullNumber // PR comments are stored as issue comments
      })
    )
  ]);

  const pr = prResponse.data;
  const commentsCount = commentsResponse.data.length;

  const detailedPR: DetailedPullRequestResponse = {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    description: pr.body || null,
    created_at: pr.created_at,
    updated_at: pr.updated_at,
    merged_at: pr.merged_at,
    closed_at: pr.closed_at,
    html_url: pr.html_url,
    state: pr.merged_at ? 'merged' as const : pr.state as 'open' | 'closed',
    draft: pr.draft || false,
    commits: pr.commits,
    additions: pr.additions,
    deletions: pr.deletions,
    changed_files: pr.changed_files,
    comments: commentsCount, // Include comments count for 💬 display
    author: {
      login: pr.user?.login || 'unknown',
      avatar_url: pr.user?.avatar_url || '',
      html_url: pr.user?.html_url || ''
    },
    repository: {
      name: repo,
      description: pr.base.repo.description,
      language: pr.base.repo.language ?? null,
      html_url: pr.base.repo.html_url
    }
  };

  console.log(`✅ Successfully fetched PR #${pullNumber}: "${pr.title}" with ${commentsCount} comments`);
  console.log(`📊 PR stats: ${formatPRStats(detailedPR)}`);
  
  return detailedPR;
}

// Re-export helpers for convenience
export * from './helpers'; 