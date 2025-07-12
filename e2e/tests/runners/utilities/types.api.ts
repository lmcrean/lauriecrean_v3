// Re-export types from shared location
export {
  PullRequestListData as PullRequestResponse,
  DetailedPullRequestData as DetailedPullRequestResponse,
  PaginationMeta,
  ApiResponse,
  DetailedPullRequestApiResponse
} from '../../../../shared/types/pull-requests';

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