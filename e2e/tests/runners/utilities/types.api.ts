// Type definitions matching the API
export interface PullRequestResponse {
  id: number;
  number: number;
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

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface ApiResponse {
  data: PullRequestResponse[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

export interface DetailedPullRequestResponse extends PullRequestResponse {
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
  comments: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface HealthResponse {
  status: 'ok' | 'warning';
  timestamp: string;
  service: string;
  github_token?: {
    present: boolean;
    length: number;
    valid_format: boolean;
    status: string;
  };
}

export interface PortInfoResponse {
  port: number;
  mode: string;
  timestamp: string;
} 