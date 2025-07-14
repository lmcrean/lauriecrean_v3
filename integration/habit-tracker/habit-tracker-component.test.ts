import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { vi } from 'vitest';
import HabitTracker from '../../apps/web/src/components/pull-request-feed/habit-tracker/HabitTracker';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('HabitTracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockHabitTrackerData = {
    data: {
      username: 'testuser',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      weeks: [
        {
          days: [
            {
              date: '2023-01-01',
              count: 2,
              pullRequests: [
                {
                  id: 1,
                  number: 123,
                  title: 'Test PR 1',
                  repository: 'test/repo',
                  state: 'merged',
                  html_url: 'https://github.com/test/repo/pull/123'
                },
                {
                  id: 2,
                  number: 124,
                  title: 'Test PR 2',
                  repository: 'test/repo2',
                  state: 'open',
                  html_url: 'https://github.com/test/repo2/pull/124'
                }
              ]
            },
            {
              date: '2023-01-02',
              count: 0,
              pullRequests: []
            },
            {
              date: '2023-01-03',
              count: 1,
              pullRequests: [
                {
                  id: 3,
                  number: 125,
                  title: 'Test PR 3',
                  repository: 'test/repo3',
                  state: 'closed',
                  html_url: 'https://github.com/test/repo3/pull/125'
                }
              ]
            },
            {
              date: '2023-01-04',
              count: 0,
              pullRequests: []
            },
            {
              date: '2023-01-05',
              count: 0,
              pullRequests: []
            },
            {
              date: '2023-01-06',
              count: 0,
              pullRequests: []
            },
            {
              date: '2023-01-07',
              count: 0,
              pullRequests: []
            }
          ]
        }
      ],
      totalPRs: 3,
      maxDailyPRs: 2
    },
    meta: {
      username: 'testuser',
      period: 'last-year',
      generated_at: '2023-12-31T23:59:59Z'
    }
  };

  it('should render loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<HabitTracker username="testuser" />);
    
    expect(screen.getByText('Pull Request Activity')).toBeInTheDocument();
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('should render habit tracker data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" />);
    
    await waitFor(() => {
      expect(screen.getByText('Pull Request Activity')).toBeInTheDocument();
      expect(screen.getByText('3 pull requests in Last 12 months')).toBeInTheDocument();
    });
  });

  it('should render error state when API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<HabitTracker username="testuser" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load habit tracker data/)).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('should handle retry functionality', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    mockedAxios.get.mockResolvedValueOnce({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" />);
    
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText('Retry');
    await userEvent.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText('3 pull requests in Last 12 months')).toBeInTheDocument();
    });
  });

  it('should handle different time periods', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" period="last-6-months" />);
    
    await waitFor(() => {
      expect(screen.getByText('3 pull requests in Last 6 months')).toBeInTheDocument();
    });
  });

  it('should call API with correct parameters', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" period="last-3-months" />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/github/habit-tracker/testuser'),
        expect.objectContaining({
          params: { period: 'last-3-months' }
        })
      );
    });
  });

  it('should use localhost URL in development', async () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost'
      },
      writable: true
    });
    
    mockedAxios.get.mockResolvedValue({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/github/habit-tracker/testuser',
        expect.any(Object)
      );
    });
  });

  it('should use production URL in production', async () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com'
      },
      writable: true
    });
    
    mockedAxios.get.mockResolvedValue({ data: mockHabitTrackerData });
    
    render(<HabitTracker username="testuser" />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api-github-lmcreans-projects.vercel.app/api/github/habit-tracker/testuser',
        expect.any(Object)
      );
    });
  });
});