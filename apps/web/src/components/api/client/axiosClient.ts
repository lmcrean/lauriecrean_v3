/**
 * Axios HTTP client configuration
 * Configures the main HTTP client with interceptors and dynamic base URL
 */

import axios from 'axios';
import { getApiBaseUrl } from '../discovery/urlResolution';

/**
 * For backwards compatibility - will be populated after discovery
 * Use a function to ensure proper detection at runtime
 */
const getInitialApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'http://localhost:3015';
    }
  }
  return 'https://api-github-main-329000596728.us-central1.run.app';
};

export let API_BASE_URL = getInitialApiUrl();

/**
 * Create axios instance with dynamic base URL
 */
const apiClient = axios.create({
  timeout: 30000, // 30 second timeout (increased for GitHub API calls)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for dynamic base URL and common headers
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Set dynamic base URL if not already set
    if (!config.baseURL) {
      config.baseURL = await getApiBaseUrl();
    }
    
    // You can add common headers, authentication tokens, etc. here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common response patterns
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error patterns
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (error.response?.status === 404) {
      error.message = error.response?.data?.message || 'Resource not found.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 