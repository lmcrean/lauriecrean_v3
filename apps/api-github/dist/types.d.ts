export interface PullRequestResponse {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    merged_at: string | null;
    html_url: string;
    state: 'open' | 'closed' | 'merged';
    repository: {
        name: string;
        description: string | null;
        language: string | null;
        html_url: string;
    };
}
export interface ApiResponse {
    data: PullRequestResponse[];
    meta: {
        username: string;
        count: number;
    };
}
export interface ErrorResponse {
    error: string;
    message: string;
}
export interface DetailedPullRequestResponse extends PullRequestResponse {
    number: number;
    author: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
    updated_at: string;
    closed_at: string | null;
    draft: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
}
//# sourceMappingURL=types.d.ts.map