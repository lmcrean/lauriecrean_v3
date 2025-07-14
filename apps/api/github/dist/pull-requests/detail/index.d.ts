import { Octokit } from '@octokit/rest';
import { DetailedPullRequestResponse } from '../../types';
/**
 * Fetch detailed information for a specific pull request
 * Includes additional data like commits, additions, deletions, and comments count
 */
export declare function fetchPullRequestDetails(octokit: Octokit, owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse>;
export * from './helpers';
//# sourceMappingURL=index.d.ts.map