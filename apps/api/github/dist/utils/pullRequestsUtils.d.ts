import { Octokit } from '@octokit/rest';
import { PullRequestResponse, PaginationMeta } from '../types';
export interface GetPullRequestsResult {
    pullRequests: PullRequestResponse[];
    pagination: PaginationMeta;
}
export interface SearchItem {
    id: number;
    number: number;
    title: string;
    body?: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    state: string;
}
/**
 * Fetch pull requests for a user using GitHub's search API
 * This provides better coverage across all repositories the user has contributed to
 */
export declare function fetchPullRequests(octokit: Octokit, username: string, page?: number, perPage?: number): Promise<GetPullRequestsResult>;
//# sourceMappingURL=pullRequestsUtils.d.ts.map