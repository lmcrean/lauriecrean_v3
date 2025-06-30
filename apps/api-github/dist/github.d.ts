import { PullRequestResponse, DetailedPullRequestResponse, PaginationMeta } from './types';
export interface GetPullRequestsResult {
    pullRequests: PullRequestResponse[];
    pagination: PaginationMeta;
}
export declare function getPullRequests(username: string, page?: number, perPage?: number): Promise<GetPullRequestsResult>;
export declare function getPullRequestDetails(owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse>;
//# sourceMappingURL=github.d.ts.map