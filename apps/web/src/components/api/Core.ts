import axios from 'axios';

// API Configuration -- not to be confused with branches e.g. api-github-34536dcg-...
// Use different ports for manual testing vs e2e testing
const getApiPort = () => {
  // Check if we're in manual testing mode
  if (process.env.REACT_APP_TEST_MODE === 'manual') {
    return '3005'; // PORT_MANUAL
  }
  // Default to e2e port for e2e testing and production development
  return '3015'; // PORT_E2E
};

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? `http://localhost:${getApiPort()}`
  : 'https://api-github-lmcrean-lmcreans-projects.vercel.app';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding common headers or handling requests
apiClient.interceptors.request.use(
  (config) => {
    // You can add common headers, authentication tokens, etc. here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response patterns
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

// Export the configured axios instance
export { apiClient };

// Export API base URL for reference
export { API_BASE_URL };

// Default export
export default apiClient;
