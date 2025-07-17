import { Router, Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { HabitTrackerDatabase } from './database';
import { GitHubHabitSync } from './github-sync';
import { DateRange } from './types';

export function createHabitTrackerRouter(octokit: Octokit, username: string): Router {
  const router = Router();
  const database = new HabitTrackerDatabase();
  const sync = new GitHubHabitSync(octokit, database, username);

  // Endpoint to trigger a refresh of pull request data
  router.post('/refresh', async (req: Request, res: Response) => {
    try {
      const dateRange: DateRange | undefined = req.body.date_range;
      
      // Validate date range if provided
      if (dateRange) {
        if (!isValidDate(dateRange.start_date) || !isValidDate(dateRange.end_date)) {
          return res.status(400).json({
            error: 'Invalid date format. Use YYYY-MM-DD'
          });
        }
        
        if (dateRange.start_date > dateRange.end_date) {
          return res.status(400).json({
            error: 'Start date must be before or equal to end date'
          });
        }
      }

      const result = await sync.refreshPullRequestData(dateRange);
      
      res.json({
        success: true,
        result
      });
    } catch (error) {
      console.error('Error refreshing habit data:', error);
      res.status(500).json({
        error: 'Failed to refresh pull request data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to get habit data for a specific date range
  router.get('/entries', (req: Request, res: Response) => {
    try {
      const { start_date, end_date } = req.query;

      // Default to last 30 days if not specified
      const endDate = (end_date as string) || new Date().toISOString().split('T')[0];
      const startDate = (start_date as string) || getDateDaysAgo(30);

      // Validate dates
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return res.status(400).json({
          error: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const entries = database.getHabitEntries(startDate, endDate);

      res.json({
        entries,
        date_range: {
          start_date: startDate,
          end_date: endDate
        }
      });
    } catch (error) {
      console.error('Error fetching habit entries:', error);
      res.status(500).json({
        error: 'Failed to fetch habit entries',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to get a single day's data
  router.get('/entries/:date', (req: Request, res: Response) => {
    try {
      const { date } = req.params;

      if (!isValidDate(date)) {
        return res.status(400).json({
          error: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const entry = database.getHabitEntry(date);

      if (!entry) {
        return res.status(404).json({
          error: 'No data found for this date',
          date
        });
      }

      res.json(entry);
    } catch (error) {
      console.error('Error fetching habit entry:', error);
      res.status(500).json({
        error: 'Failed to fetch habit entry',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to get overall statistics
  router.get('/stats', (req: Request, res: Response) => {
    try {
      const stats = database.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching habit stats:', error);
      res.status(500).json({
        error: 'Failed to fetch habit statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

// Helper functions
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}