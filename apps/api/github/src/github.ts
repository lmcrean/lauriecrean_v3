// Trigger redeployment for CORS and branch API URL fixes
import { Octokit } from '@octokit/rest';
import { PullRequestResponse, DetailedPullRequestResponse, PaginationMeta } from './types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Debug logging
console.log('GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);

export interface GetPullRequestsResult {
  pullRequests: PullRequestResponse[];
  pagination: PaginationMeta;
}

export async function getPullRequests(username: string, page: number = 1, perPage: number = 20): Promise<GetPullRequestsResult> {
  try {
    // Use GitHub search API to get the most recent PRs across ALL repositories
    const searchQuery = `author:${username} type:pr`;
    
    console.log(`Searching for PRs by ${username} using GitHub Search API (page ${page})`);
    
    // Calculate how many results we need to fetch to serve this page
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    // We need to fetch enough items from GitHub to serve this page
    // GitHub search API returns max 100 per page, so we need to determine how many pages to fetch
    const itemsNeededFromGitHub = endIndex; // Total items needed from start
    const githubPagesNeeded = Math.ceil(itemsNeededFromGitHub / 100);
    
    // Fetch all necessary GitHub search pages
    let allSearchItems: any[] = [];
    
    for (let githubPage = 1; githubPage <= githubPagesNeeded; githubPage++) {
      const itemsToFetchThisPage = Math.min(100, itemsNeededFromGitHub - ((githubPage - 1) * 100));
      
      if (itemsToFetchThisPage <= 0) break;
      
      try {
        const { data: searchResults } = await octokit.rest.search.issuesAndPullRequests({
          q: searchQuery,
          sort: 'created',
          order: 'desc',
          per_page: itemsToFetchThisPage,
          page: githubPage
        });

        allSearchItems.push(...searchResults.items);
        
        // Store total count from first page response
        if (githubPage === 1) {
          console.log(`Found ${searchResults.total_count} total PRs for ${username} via search`);
        }
        
        // If this page returned fewer items than requested, we've hit the end
        if (searchResults.items.length < itemsToFetchThisPage) {
          break;
        }
      } catch (error) {
        console.warn(`Failed to fetch GitHub search page ${githubPage}:`, error);
        break;
      }
    }
    
    // Get total count from first search (we need to do at least one search to get this)
    let totalCount = 0;
    if (allSearchItems.length === 0) {
      // If we haven't fetched anything yet, do a minimal search just to get total count
      const { data: searchResults } = await octokit.rest.search.issuesAndPullRequests({
        q: searchQuery,
        sort: 'created',
        order: 'desc',
        per_page: 1,
        page: 1
      });
      totalCount = searchResults.total_count;
    } else {
      // Use a fresh search to get accurate total count
      const { data: countSearch } = await octokit.rest.search.issuesAndPullRequests({
        q: searchQuery,
        sort: 'created',
        order: 'desc',
        per_page: 1,
        page: 1
      });
      totalCount = countSearch.total_count;
    }
    
    // Convert search results to our format
    const allPRs: PullRequestResponse[] = [];
    
    for (const item of allSearchItems) {
      try {
        // Extract owner and repo from the URL
        const urlParts = item.html_url.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        
        // Get the full PR details
        const { data: pr } = await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: item.number
        });

        // Get repository details
        const { data: repoData } = await octokit.rest.repos.get({
          owner,
          repo
        });

        const prData: PullRequestResponse = {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          description: pr.body || null,
          created_at: pr.created_at,
          merged_at: pr.merged_at,
          html_url: pr.html_url,
          state: pr.merged_at ? 'merged' as const : pr.state as 'open' | 'closed',
          repository: {
            name: repo,
            description: repoData.description,
            language: repoData.language ?? null,
            html_url: repoData.html_url
          }
        };

        allPRs.push(prData);
        
      } catch (prError) {
        console.warn(`Failed to fetch details for PR ${item.number}:`, prError);
        continue;
      }
    }

    // Sort by creation date (newest first) - this should already be sorted by search API
    const sortedPRs = allPRs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Get the correct page of results - SINGLE SLICE, NO DOUBLE SLICING
    const paginatedPRs = sortedPRs.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / perPage);

    const pagination: PaginationMeta = {
      page,
      per_page: perPage,
      total_count: totalCount,
      total_pages: totalPages,
      has_next_page: page < totalPages,
      has_previous_page: page > 1
    };

    console.log(`Returning ${paginatedPRs.length} PRs for ${username} (page ${page}/${totalPages}, total: ${totalCount})`);
    console.log(`Fetched ${allPRs.length} total items, slicing ${startIndex}-${endIndex}`);
    if (paginatedPRs.length > 0) {
      console.log(`First PR on this page: ${paginatedPRs[0]?.title} (${paginatedPRs[0]?.created_at})`);
    }
    
    return {
      pullRequests: paginatedPRs,
      pagination
    };

  } catch (error) {
    console.error(`Failed to fetch pull requests for ${username}:`, error);
    throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
}

export async function getPullRequestDetails(owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse> {
  try {
    console.log(`Fetching PR #${pullNumber} from ${owner}/${repo}`);
    
    // Fetch PR details and comments count in parallel for better performance
    const [prResponse, commentsResponse] = await Promise.all([
      octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      }),
      octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: pullNumber // PR comments are stored as issue comments
      })
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

    console.log(`Successfully fetched PR #${pullNumber}: "${pr.title}" with ${commentsCount} comments`);
    return detailedPR;

  } catch (error) {
    console.error(`Failed to fetch PR #${pullNumber} from ${owner}/${repo}:`, error);
    throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  }
} 