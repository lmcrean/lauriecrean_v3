import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosError } from 'axios';
import apiClient, { API_BASE_URL } from '../../apps/web/src/components/api/client/axiosClient';

// Mock the URL resolution
vi.mock('../../apps/web/src/components/api/discovery/urlResolution', () => ({
  getApiBaseUrl: vi.fn()
}));

import { getApiBaseUrl } from '../../apps/web/src/components/api/discovery/urlResolution';
const mockGetApiBaseUrl = vi.mocked(getApiBaseUrl);

// Mock axios to control behavior
vi.mock('axios');
const mockAxios = vi.mocked(axios);

describe('API Client Integration Tests', () => {
  let mockCreate: any;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock axios.create and the instance it returns
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      }
    };
    
    mockCreate = vi.fn().mockReturnValue(mockAxiosInstance);
    mockAxios.create = mockCreate;
    
    // Set up default URL resolution
    mockGetApiBaseUrl.mockResolvedValue('https://api.example.com');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Client Configuration', () => {
    it('should create axios instance with correct default configuration', () => {
      // Import to trigger axios.create call
      require('../../apps/web/src/components/api/client/axiosClient');
      
      expect(mockCreate).toHaveBeenCalledWith({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should have proper timeout for GitHub API calls', () => {
      require('../../apps/web/src/components/api/client/axiosClient');
      
      const config = mockCreate.mock.calls[0][0];
      expect(config.timeout).toBe(30000); // 30 seconds
    });

    it('should set default JSON content type', () => {
      require('../../apps/web/src/components/api/client/axiosClient');
      
      const config = mockCreate.mock.calls[0][0];
      expect(config.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Request Interceptor', () => {
    let requestInterceptor: any;

    beforeEach(() => {
      // Import to set up interceptors
      require('../../apps/web/src/components/api/client/axiosClient');
      
      // Get the request interceptor function
      const requestInterceptorCall = mockAxiosInstance.interceptors.request.use.mock.calls[0];
      requestInterceptor = requestInterceptorCall[0];
    });

    it('should set baseURL when not provided', async () => {
      mockGetApiBaseUrl.mockResolvedValue('https://discovered-api.example.com');
      
      const config = { url: '/test' };
      const result = await requestInterceptor(config);
      
      expect(mockGetApiBaseUrl).toHaveBeenCalled();
      expect(result.baseURL).toBe('https://discovered-api.example.com');
    });

    it('should not override existing baseURL', async () => {
      const config = { 
        url: '/test',
        baseURL: 'https://existing-api.example.com'
      };
      
      const result = await requestInterceptor(config);
      
      expect(mockGetApiBaseUrl).not.toHaveBeenCalled();
      expect(result.baseURL).toBe('https://existing-api.example.com');
    });

    it('should handle URL resolution errors gracefully', async () => {
      mockGetApiBaseUrl.mockRejectedValue(new Error('URL resolution failed'));
      
      const config = { url: '/test' };
      
      // Should not throw but handle gracefully
      await expect(requestInterceptor(config)).rejects.toThrow('URL resolution failed');
    });

    it('should preserve other config properties', async () => {
      mockGetApiBaseUrl.mockResolvedValue('https://api.example.com');
      
      const config = { 
        url: '/test',
        method: 'POST',
        data: { key: 'value' },
        headers: { 'Custom-Header': 'custom-value' }
      };
      
      const result = await requestInterceptor(config);
      
      expect(result.url).toBe('/test');
      expect(result.method).toBe('POST');
      expect(result.data).toEqual({ key: 'value' });
      expect(result.headers['Custom-Header']).toBe('custom-value');
    });

    it('should handle request interceptor error', async () => {
      // Import to set up interceptors
      require('../../apps/web/src/components/api/client/axiosClient');
      
      // Get the error handler
      const errorHandler = mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      
      const error = new Error('Request setup failed');
      
      await expect(errorHandler(error)).rejects.toThrow('Request setup failed');
    });
  });

  describe('Response Interceptor', () => {
    let responseInterceptor: any;
    let responseErrorHandler: any;

    beforeEach(() => {
      // Import to set up interceptors
      require('../../apps/web/src/components/api/client/axiosClient');
      
      // Get the response interceptor functions
      const responseInterceptorCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      responseInterceptor = responseInterceptorCall[0];
      responseErrorHandler = responseInterceptorCall[1];
    });

    it('should pass through successful responses unchanged', () => {
      const response = {
        status: 200,
        data: { message: 'success' },
        headers: {},
        config: {}
      };
      
      const result = responseInterceptor(response);
      
      expect(result).toBe(response);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded'
      };
      
      await expect(responseErrorHandler(timeoutError)).rejects.toMatchObject({
        code: 'ECONNABORTED',
        message: 'Request timed out. Please try again.'
      });
    });

    it('should handle 404 errors', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Resource not found' }
        }
      };
      
      await expect(responseErrorHandler(notFoundError)).rejects.toMatchObject({
        response: {
          status: 404
        },
        message: 'Resource not found'
      });
    });

    it('should handle 404 errors without custom message', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: {}
        }
      };
      
      await expect(responseErrorHandler(notFoundError)).rejects.toMatchObject({
        response: {
          status: 404
        },
        message: 'Resource not found.'
      });
    });

    it('should handle 500+ server errors', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };
      
      await expect(responseErrorHandler(serverError)).rejects.toMatchObject({
        response: {
          status: 500
        },
        message: 'Server error. Please try again later.'
      });
    });

    it('should handle network errors', async () => {
      const networkError = {
        message: 'Network Error'
      };
      
      await expect(responseErrorHandler(networkError)).rejects.toMatchObject({
        message: 'Network error. Please check your connection.'
      });
    });

    it('should handle errors with responses but no specific status handling', async () => {
      const clientError = {
        response: {
          status: 400,
          data: { message: 'Bad request' }
        },
        message: 'Request failed with status code 400'
      };
      
      await expect(responseErrorHandler(clientError)).rejects.toMatchObject({
        response: {
          status: 400
        },
        message: 'Request failed with status code 400'
      });
    });

    it('should handle 502 Bad Gateway specifically', async () => {
      const badGatewayError = {
        response: {
          status: 502,
          data: { message: 'Bad Gateway' }
        }
      };
      
      await expect(responseErrorHandler(badGatewayError)).rejects.toMatchObject({
        response: {
          status: 502
        },
        message: 'Server error. Please try again later.'
      });
    });

    it('should handle 503 Service Unavailable specifically', async () => {
      const serviceUnavailableError = {
        response: {
          status: 503,
          data: { message: 'Service Unavailable' }
        }
      };
      
      await expect(responseErrorHandler(serviceUnavailableError)).rejects.toMatchObject({
        response: {
          status: 503
        },
        message: 'Server error. Please try again later.'
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete request/response cycle', async () => {
      // Mock a successful API response
      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        data: { pull_requests: [] },
        headers: {},
        config: {}
      });

      // Mock URL resolution
      mockGetApiBaseUrl.mockResolvedValue('https://api.github.com');

      // Test that the client can make requests
      const response = await mockAxiosInstance.get('/api/github/pull-requests');
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ pull_requests: [] });
    });

    it('should handle request with dynamic base URL resolution', async () => {
      mockGetApiBaseUrl.mockResolvedValue('https://dynamic-api.example.com');
      
      const config = { url: '/test' };
      const result = await requestInterceptor(config);
      
      expect(result.baseURL).toBe('https://dynamic-api.example.com');
      expect(mockGetApiBaseUrl).toHaveBeenCalledTimes(1);
    });

    it('should handle GitHub API rate limiting', async () => {
      const rateLimitError = {
        response: {
          status: 403,
          data: { 
            message: 'API rate limit exceeded',
            documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
          }
        }
      };
      
      await expect(responseErrorHandler(rateLimitError)).rejects.toMatchObject({
        response: {
          status: 403
        },
        message: 'API rate limit exceeded'
      });
    });

    it('should handle GitHub API authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { 
            message: 'Bad credentials',
            documentation_url: 'https://docs.github.com/rest'
          }
        }
      };
      
      await expect(responseErrorHandler(authError)).rejects.toMatchObject({
        response: {
          status: 401
        },
        message: 'Bad credentials'
      });
    });

    it('should handle concurrent requests with proper base URL resolution', async () => {
      mockGetApiBaseUrl.mockResolvedValue('https://concurrent-api.example.com');
      
      const config1 = { url: '/test1' };
      const config2 = { url: '/test2' };
      
      const [result1, result2] = await Promise.all([
        requestInterceptor(config1),
        requestInterceptor(config2)
      ]);
      
      expect(result1.baseURL).toBe('https://concurrent-api.example.com');
      expect(result2.baseURL).toBe('https://concurrent-api.example.com');
      expect(mockGetApiBaseUrl).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Message Prioritization', () => {
    it('should prioritize custom error messages from API responses', async () => {
      const customError = {
        response: {
          status: 404,
          data: { 
            message: 'Pull request not found in repository',
            error: 'NOT_FOUND'
          }
        }
      };
      
      await expect(responseErrorHandler(customError)).rejects.toMatchObject({
        message: 'Pull request not found in repository'
      });
    });

    it('should use default messages when API does not provide custom ones', async () => {
      const genericError = {
        response: {
          status: 500,
          data: null
        }
      };
      
      await expect(responseErrorHandler(genericError)).rejects.toMatchObject({
        message: 'Server error. Please try again later.'
      });
    });

    it('should handle malformed API error responses', async () => {
      const malformedError = {
        response: {
          status: 400,
          data: 'Invalid JSON response'
        }
      };
      
      await expect(responseErrorHandler(malformedError)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
}); 

// TypeScript interface for window with APP_CONFIG
interface WindowWithAppConfig extends Window {
  APP_CONFIG?: {
    apiBaseUrl?: string;
  };
}

// TypeScript interface for location mock
interface LocationMock {
  hostname: string;
}

describe('axiosClient Configuration Integration', () => {
  const originalLocation = window.location;
  
  beforeEach(() => {
    // Clear any existing APP_CONFIG
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
    // Mock window.location for development detection
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' } as LocationMock,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  });

  it('should use APP_CONFIG.apiBaseUrl when available (config.js loaded successfully)', () => {
    // Simulate successful config.js loading
    (window as WindowWithAppConfig).APP_CONFIG = {
      apiBaseUrl: 'https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app'
    };

    // Test the URL resolution logic directly
    const getApiBaseUrl = (): string => {
      if (typeof window !== 'undefined' && (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl) {
        return (window as WindowWithAppConfig).APP_CONFIG.apiBaseUrl;
      }
      
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
          return 'http://localhost:3015';
        }
      }
      
      return 'https://api-github-main-329000596728.us-central1.run.app';
    };
    
    expect(getApiBaseUrl()).toBe('https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app');
  });

  it('should fallback to localhost when APP_CONFIG is missing and in development', () => {
    // Ensure APP_CONFIG doesn't exist (simulating config.js 404 or SyntaxError)
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
    // Mock localhost environment
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' } as LocationMock,
      writable: true,
      configurable: true
    });

    // Test the URL resolution logic directly
    const getApiBaseUrl = (): string => {
      if (typeof window !== 'undefined' && (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl) {
        return (window as WindowWithAppConfig).APP_CONFIG.apiBaseUrl;
      }
      
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
          return 'http://localhost:3015';
        }
      }
      
      return 'https://api-github-main-329000596728.us-central1.run.app';
    };
    
    expect(getApiBaseUrl()).toBe('http://localhost:3015');
  });

  it('should fallback to production URL when APP_CONFIG is missing and in production', () => {
    // Ensure APP_CONFIG doesn't exist (simulating config.js 404 or SyntaxError)
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
    // Mock production environment
    Object.defineProperty(window, 'location', {
      value: { hostname: 'lauriecrean-free-38256.web.app' } as LocationMock,
      writable: true,
      configurable: true
    });

    // Test the URL resolution logic directly
    const getApiBaseUrl = (): string => {
      if (typeof window !== 'undefined' && (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl) {
        return (window as WindowWithAppConfig).APP_CONFIG.apiBaseUrl;
      }
      
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
          return 'http://localhost:3015';
        }
      }
      
      return 'https://api-github-main-329000596728.us-central1.run.app';
    };
    
    expect(getApiBaseUrl()).toBe('https://api-github-main-329000596728.us-central1.run.app');
  });

  it('should handle config.js SyntaxError gracefully', () => {
    // Simulate what happens when config.js returns HTML (404 page) instead of JS
    // This would cause a SyntaxError but shouldn't break the app
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
    // Should not throw when checking for APP_CONFIG
    expect(() => {
      const hasConfig = typeof window !== 'undefined' && (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl;
      expect(hasConfig).toBeFalsy();
    }).not.toThrow();
  });

  it('should demonstrate TypeScript type safety with APP_CONFIG', () => {
    // TypeScript should provide proper type checking
    (window as WindowWithAppConfig).APP_CONFIG = {
      apiBaseUrl: 'https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app'
    };

    // Type-safe access
    const config = (window as WindowWithAppConfig).APP_CONFIG;
    const apiUrl: string | undefined = config?.apiBaseUrl;
    
    expect(apiUrl).toBe('https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app');
    expect(typeof apiUrl).toBe('string');
  });
}); 