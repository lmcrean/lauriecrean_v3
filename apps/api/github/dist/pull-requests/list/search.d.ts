import { Octokit } from '@octokit/rest';
import { SearchItem } from './types';
/**
 * Fetch search results from GitHub's search API with pagination support
 */
export declare function fetchSearchResults(octokit: Octokit, searchQuery: string, itemsNeeded: number): Promise<SearchItem[]>;
/**
 * Get total count of pull requests for pagination
 */
export declare function getTotalPullRequestCount(octokit: Octokit, searchQuery: string): Promise<number>;
//# sourceMappingURL=search.d.ts.map