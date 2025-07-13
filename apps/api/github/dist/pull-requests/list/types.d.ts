import { PullRequestResponse, PaginationMeta } from '../../types';
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
//# sourceMappingURL=types.d.ts.map