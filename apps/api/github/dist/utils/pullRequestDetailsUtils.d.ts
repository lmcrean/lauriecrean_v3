import { Octokit } from '@octokit/rest';
import { DetailedPullRequestResponse } from '../types';
/**
 * Fetch detailed information for a specific pull request
 * Includes additional data like commits, additions, deletions, and comments count
 */
export declare function fetchPullRequestDetails(octokit: Octokit, owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse>;
/**
 * Validate pull request parameters before making API calls
 */
export declare function validatePullRequestParams(owner: string, repo: string, pullNumber: number): void;
/**
 * Extract owner and repo from a GitHub PR URL
 * Useful for parsing URLs from search results
 */
export declare function extractRepoInfoFromUrl(htmlUrl: string): {
    owner: string;
    repo: string;
};
/**
 * Format PR statistics for logging
 */
export declare function formatPRStats(pr: DetailedPullRequestResponse): string;
//# sourceMappingURL=pullRequestDetailsUtils.d.ts.map