import { PaginationMeta } from './types';
export declare class GitHubService {
    private octokit;
    constructor(apiToken: string);
    /**
     * Get pull requests for a user with pagination support
     */
    getPullRequests(username: string, page?: number, perPage?: number): Promise<{
        data: import("./types").PullRequestResponse[];
        pagination: PaginationMeta;
    }>;
    /**
     * Get detailed information for a specific pull request
     */
    getPullRequestDetails(owner: string, repo: string, pullNumber: number): Promise<{
        data: import("./types").DetailedPullRequestResponse;
    }>;
    /**
     * Check current GitHub API rate limit status
     */
    getRateLimit(): Promise<{
        data: {
            remaining: number;
            limit: number;
            resetTime: Date;
            used: number;
        };
        message: string;
    }>;
}
//# sourceMappingURL=github.d.ts.map