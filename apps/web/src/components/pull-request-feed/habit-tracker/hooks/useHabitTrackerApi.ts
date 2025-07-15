import { useState, useCallback } from 'react';
import apiClient from '../../../api/Core';
import { HabitTrackerData } from '../../../../../../shared/types/habit-tracker';

interface UseHabitTrackerApiProps {
  username: string;
  period: 'last-year' | 'last-6-months' | 'last-3-months';
}

interface HabitTrackerApiResponse {
  data: HabitTrackerData;
  meta?: {
    message?: string;
  };
}

export const useHabitTrackerApi = ({ username, period }: UseHabitTrackerApiProps) => {
  const [data, setData] = useState<HabitTrackerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<HabitTrackerApiResponse>(
        `/api/github/habit-tracker/${username}`,
        {
          params: { period },
          timeout: 10000
        }
      );

      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to load habit tracker data';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out';
      } else if (err.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (err.response?.status === 403) {
        errorMessage = 'Rate limit exceeded';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Habit tracker API error:', err);
    } finally {
      setLoading(false);
    }
  }, [username, period]);

  return {
    data,
    loading,
    error,
    fetchData
  };
};