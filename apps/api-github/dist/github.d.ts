import { PullRequestResponse, DetailedPullRequestResponse } from './types';
export declare function getPullRequests(username: string, limit: number): Promise<PullRequestResponse[]>;
export declare function getPullRequestDetails(owner: string, repo: string, pullNumber: number): Promise<DetailedPullRequestResponse>;
//# sourceMappingURL=github.d.ts.map