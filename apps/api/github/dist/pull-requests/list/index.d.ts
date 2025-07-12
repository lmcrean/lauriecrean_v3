import { Octokit } from '@octokit/rest';
import { GetPullRequestsResult } from './types';
/**
 * Fetch pull requests for a user using GitHub's search API
 * This provides better coverage across all repositories the user has contributed to
 */
export declare function fetchPullRequests(octokit: Octokit, username: string, page?: number, perPage?: number): Promise<GetPullRequestsResult>;
export * from './types';
//# sourceMappingURL=index.d.ts.map