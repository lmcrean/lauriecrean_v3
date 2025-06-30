// TypeScript interfaces for GitHub API responses

export interface PullRequestResponse {
  id: number;
  title: string;
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