import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

describe('Habit Tracker API Integration', () => {
  const baseURL = 'http://localhost:3015';
  let serverProcess: any;

  beforeAll(async () => {
    // The server should be running on port 3015 for these tests
    // We'll just test against a running server
    try {
      await axios.get(`${baseURL}/api/health`);
    } catch (error) {
      console.warn('Server may not be running on port 3015 for integration tests');
    }
  });

  describe('GET /api/github/habit-tracker/:username', () => {
    it('should return habit tracker data for a valid username', async () => {
      const username = 'lmcrean';
      
      const response = await axios.get(`${baseURL}/api/github/habit-tracker/${username}`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(response.data).toHaveProperty('meta');
      
      const { data, meta } = response.data;
      
      // Check data structure
      expect(data).toHaveProperty('username', username);
      expect(data).toHaveProperty('startDate');
      expect(data).toHaveProperty('endDate');
      expect(data).toHaveProperty('weeks');
      expect(data).toHaveProperty('totalPRs');
      expect(data).toHaveProperty('maxDailyPRs');
      
      // Check meta structure
      expect(meta).toHaveProperty('username', username);
      expect(meta).toHaveProperty('period');
      expect(meta).toHaveProperty('generated_at');
      
      // Check weeks structure
      expect(Array.isArray(data.weeks)).toBe(true);
      if (data.weeks.length > 0) {
        const firstWeek = data.weeks[0];
        expect(firstWeek).toHaveProperty('days');
        expect(Array.isArray(firstWeek.days)).toBe(true);
        expect(firstWeek.days).toHaveLength(7);
        
        // Check day structure
        const firstDay = firstWeek.days[0];
        expect(firstDay).toHaveProperty('date');
        expect(firstDay).toHaveProperty('count');
        expect(firstDay).toHaveProperty('pullRequests');
        expect(Array.isArray(firstDay.pullRequests)).toBe(true);
        
        // Check PR structure if any PRs exist
        if (firstDay.pullRequests.length > 0) {
          const firstPR = firstDay.pullRequests[0];
          expect(firstPR).toHaveProperty('id');
          expect(firstPR).toHaveProperty('number');
          expect(firstPR).toHaveProperty('title');
          expect(firstPR).toHaveProperty('repository');
          expect(firstPR).toHaveProperty('state');
          expect(firstPR).toHaveProperty('html_url');
        }
      }
    }, 30000); // 30 second timeout for GitHub API calls

    it('should handle different time periods', async () => {
      const username = 'lmcrean';
      const periods = ['last-year', 'last-6-months', 'last-3-months'];
      
      for (const period of periods) {
        const response = await axios.get(`${baseURL}/api/github/habit-tracker/${username}`, {
          params: { period }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.meta.period).toBe(period);
      }
    }, 45000);

    it('should return 400 for missing username', async () => {
      try {
        await axios.get(`${baseURL}/api/github/habit-tracker/`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Username is required');
      }
    });

    it('should return 400 for invalid period', async () => {
      const username = 'lmcrean';
      
      try {
        await axios.get(`${baseURL}/api/github/habit-tracker/${username}`, {
          params: { period: 'invalid-period' }
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Invalid period parameter');
      }
    });

    it('should handle non-existent username gracefully', async () => {
      const username = 'non-existent-user-12345';
      
      try {
        const response = await axios.get(`${baseURL}/api/github/habit-tracker/${username}`);
        // Should either succeed with empty data or fail gracefully
        if (response.status === 200) {
          expect(response.data.data.totalPRs).toBe(0);
          expect(response.data.data.maxDailyPRs).toBe(0);
        }
      } catch (error: any) {
        // Should be a 404 or 500 error, not a crash
        expect([404, 500]).toContain(error.response.status);
      }
    }, 15000);
  });
});