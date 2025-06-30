/**
 * @jest-environment jsdom
 */

import axios from 'axios';
import apiClient, { API_BASE_URL } from '../api/Core';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Core API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Configuration', () => {
    it('should have correct base URL', () => {
      expect(API_BASE_URL).toBe('https://api-github-lmcrean-lmcreans-projects.vercel.app');
    });

    it('should create axios instance with correct config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api-github-lmcrean-lmcreans-projects.vercel.app',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Request Interceptor', () => {
    it('should pass through requests unchanged', async () => {
      const mockConfig = {
        url: '/test',
        method: 'GET',
        headers: {}
      };

      // Mock the create method to return our apiClient
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn((successHandler) => {
              // Test the success handler
              const result = successHandler(mockConfig);
              expect(result).toBe(mockConfig);
            })
          },
          response: {
            use: jest.fn()
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      // Import to trigger the interceptor setup
      await import('../api/Core');
    });

    it('should reject on request error', async () => {
      const mockError = new Error('Request error');

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn((successHandler, errorHandler) => {
              // Test the error handler
              expect(() => errorHandler(mockError)).rejects.toThrow('Request error');
            })
          },
          response: {
            use: jest.fn()
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });
  });

  describe('Response Interceptor', () => {
    it('should pass through successful responses', async () => {
      const mockResponse = {
        data: { test: 'data' },
        status: 200,
        statusText: 'OK'
      };

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn((successHandler) => {
              const result = successHandler(mockResponse);
              expect(result).toBe(mockResponse);
            })
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout');
      (timeoutError as any).code = 'ECONNABORTED';

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn((successHandler, errorHandler) => {
              const result = errorHandler(timeoutError);
              expect(result).rejects.toEqual(expect.objectContaining({
                message: 'Request timed out. Please try again.'
              }));
            })
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });

    it('should handle 404 errors', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn((successHandler, errorHandler) => {
              const result = errorHandler(notFoundError);
              expect(result).rejects.toEqual(expect.objectContaining({
                message: 'User not found'
              }));
            })
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });

    it('should handle 500+ server errors', async () => {
      const serverError = {
        response: {
          status: 500,
          data: {}
        }
      };

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn((successHandler, errorHandler) => {
              const result = errorHandler(serverError);
              expect(result).rejects.toEqual(expect.objectContaining({
                message: 'Server error. Please try again later.'
              }));
            })
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });

    it('should handle network errors', async () => {
      const networkError = {
        message: 'Network Error'
      };

      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn((successHandler, errorHandler) => {
              const result = errorHandler(networkError);
              expect(result).rejects.toEqual(expect.objectContaining({
                message: 'Network error. Please check your connection.'
              }));
            })
          }
        }
      };

      mockedAxios.create.mockReturnValue(mockInstance as any);
      
      await import('../api/Core');
    });
  });

  describe('Exports', () => {
    it('should export apiClient as default', () => {
      expect(apiClient).toBeDefined();
    });

    it('should export API_BASE_URL', () => {
      expect(API_BASE_URL).toBe('https://api-github-lmcrean-lmcreans-projects.vercel.app');
    });
  });
}); 