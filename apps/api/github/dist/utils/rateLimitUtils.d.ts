import { Octokit } from '@octokit/rest';
export declare const delay: (ms: number) => Promise<void>;
export declare function retryApiCall<T>(apiCall: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
export declare function checkRateLimit(octokit: Octokit): Promise<{
    remaining: number;
    limit: number;
    resetTime: Date;
    used: number;
}>;
export declare function logRateLimitStatus(remaining: number, limit: number, operation: string): void;
export declare function estimateApiCalls(operation: 'pull_requests' | 'pull_request_details', itemCount?: number): number;
export declare function ensureSufficientRateLimit(octokit: Octokit, operation: 'pull_requests' | 'pull_request_details', itemCount?: number): Promise<boolean>;
//# sourceMappingURL=rateLimitUtils.d.ts.map