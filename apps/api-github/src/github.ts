import { Octokit } from '@octokit/rest';
import { PullRequestResponse, DetailedPullRequestResponse } from './types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Debug logging
console.log('GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);

export async function getPullRequests(username: string, limit: number): Promise<PullRequestResponse[]> {
  try {
    // Get user's repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100
    });

    console.log(`Found ${repos.length} repositories for ${username}`);
    
    const allPRs: PullRequestResponse[] = [];

    // Get PRs from each repo (limit to first 20 repos for rate limiting)
    for (const repo of repos.slice(0, 20)) {
      try {
        const { data: prs } = await octokit.rest.pulls.list({
          owner: repo.owner.login,
          repo: repo.name,
          state: 'all',
          sort: 'created',
          direction: 'desc',
          per_page: 10
        });

        // Filter PRs by the target user and format response
        const userPRs = prs
          .filter(pr => pr.user?.login === username)
          .map(pr => ({
            id: pr.id,
            title: pr.title,
            description: pr.body || null,
            created_at: pr.created_at,
            merged_at: pr.merged_at,
            html_url: pr.html_url,
            state: pr.merged_at ? 'merged' as const : pr.state as 'open' | 'closed',
            repository: {
              name: repo.name,
              description: repo.description,
              language: repo.language ?? null,
              html_url: repo.html_url
            }
          }));

        allPRs.push(...userPRs);
        
        if (userPRs.length > 0) {
          console.log(`Found ${userPRs.length} PRs in ${repo.name}`);
        }
      } catch (repoError) {
        console.warn(`Failed to fetch PRs for ${repo.name}:`, repoError);
        continue;
      }
    }

    // Sort by creation date (newest first) and limit results
    const sortedPRs = allPRs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    console.log(`Returning ${sortedPRs.length} total PRs for ${username}`);
    return sortedPRs;

  } catch (error) {
    console.error(`Failed to fetch pull requests for ${username}:`, error);
    throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
}

export async function getPullRequestDetails(owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse> {
  try {
    console.log(`Fetching PR #${pullNumber} from ${owner}/${repo}`);
    
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber
    });

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

    console.log(`Successfully fetched PR #${pullNumber}: "${pr.title}"`);
    return detailedPR;

  } catch (error) {
    console.error(`Failed to fetch PR #${pullNumber} from ${owner}/${repo}:`, error);
    throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
} 