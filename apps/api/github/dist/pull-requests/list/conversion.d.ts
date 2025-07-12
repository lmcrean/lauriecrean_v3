import { Octokit } from '@octokit/rest';
import { PullRequestResponse } from '../../types';
import { SearchItem } from './types';
/**
 * Convert search results to detailed PR objects
 * Limits the number of detailed API calls to prevent rate limiting during tests
 */
export declare function convertSearchResultsToPRs(octokit: Octokit, searchItems: SearchItem[]): Promise<PullRequestResponse[]>;
/**
 * Fetch detailed data for a single pull request
 */
export declare function fetchDetailedPRData(octokit: Octokit, item: SearchItem): Promise<PullRequestResponse>;
//# sourceMappingURL=conversion.d.ts.map