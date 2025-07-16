/**
 * @jest-environment jsdom
 */

import axios from 'axios';
import apiClient, { API_BASE_URL } from '../api/Core';

// Axios is mocked automatically via __mocks__/axios.ts

describe('Core API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should have correct base URL', () => {
      expect(API_BASE_URL).toBe('https://api-github-main-329000596728.us-central1.run.app');
    });

    it('should have axios create method available', () => {
      expect(axios.create).toBeDefined();
      expect(typeof axios.create).toBe('function');
    });

    it('should export apiClient as default', () => {
      expect(apiClient).toBeDefined();
      expect(typeof apiClient).toBe('object');
    });

    it('should export API_BASE_URL constant', () => {
      expect(API_BASE_URL).toBe('https://api-github-main-329000596728.us-central1.run.app');
    });
  });

  describe('API Client Methods', () => {
    it('should have get method', () => {
      expect(apiClient.get).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
    });

    it('should have post method', () => {
      expect(apiClient.post).toBeDefined();
      expect(typeof apiClient.post).toBe('function');
    });

    it('should have interceptors configured', () => {
      expect(apiClient.interceptors).toBeDefined();
      expect(apiClient.interceptors.request).toBeDefined();
      expect(apiClient.interceptors.response).toBeDefined();
    });
  });
}); 