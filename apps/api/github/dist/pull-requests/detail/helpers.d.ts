import { DetailedPullRequestResponse } from '../../types';
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
//# sourceMappingURL=helpers.d.ts.map