/**
 * @jest-environment jsdom
 */

import axios from 'axios';

// Mock axios before importing Core
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a proper mock instance with interceptors
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn()
    },
    response: {
      use: jest.fn()
    }
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock axios.create to return our mock instance
mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

// Now import Core after setting up the mocks
import apiClient, { API_BASE_URL } from '../api/Core';

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

    it('should setup request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should setup response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Exports', () => {
    it('should export apiClient as default', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient).toBe(mockAxiosInstance);
    });

    it('should export API_BASE_URL', () => {
      expect(API_BASE_URL).toBe('https://api-github-lmcrean-lmcreans-projects.vercel.app');
    });
  });
}); 