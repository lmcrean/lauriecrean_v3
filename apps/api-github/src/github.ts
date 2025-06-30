import { Octokit } from '@octokit/rest';
import { PullRequestResponse } from './types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

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
            created_at: pr.created_at,
            merged_at: pr.merged_at,
            html_url: pr.html_url,
            state: pr.merged_at ? 'merged' as const : pr.state as 'open' | 'closed',
            repository: {
              name: repo.name,
              description: repo.description,
              language: repo.language || null,
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