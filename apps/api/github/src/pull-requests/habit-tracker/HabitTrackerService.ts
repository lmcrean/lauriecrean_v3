import { Octokit } from '@octokit/rest';
import { HabitTrackerData, HabitTrackerDayData, HabitTrackerWeekData } from '../../types/habit-tracker';

export class HabitTrackerService {
  private octokit: Octokit;

  constructor(octokit: Octokit) {
    this.octokit = octokit;
  }

  /**
   * Generate habit tracker data for a user's pull requests
   */
  async generateHabitTrackerData(
    username: string,
    period: 'last-year' | 'last-6-months' | 'last-3-months' = 'last-year'
  ): Promise<HabitTrackerData> {
    const endDate = new Date();
    const startDate = this.getStartDate(period);

    // Get all PRs for the user in the specified period
    const pullRequests = await this.getAllPullRequestsInPeriod(username, startDate, endDate);

    // Group PRs by date
    const prsByDate = this.groupPullRequestsByDate(pullRequests);

    // Generate weekly data structure
    const weeks = this.generateWeeklyData(startDate, endDate, prsByDate);

    // Calculate statistics
    const totalPRs = pullRequests.length;
    const maxDailyPRs = Math.max(...Object.values(prsByDate).map(prs => prs.length), 0);

    return {
      username,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      weeks,
      totalPRs,
      maxDailyPRs
    };
  }

  /**
   * Get start date based on period
   */
  private getStartDate(period: 'last-year' | 'last-6-months' | 'last-3-months'): Date {
    const now = new Date();
    const startDate = new Date(now);

    switch (period) {
      case 'last-year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'last-6-months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last-3-months':
        startDate.setMonth(now.getMonth() - 3);
        break;
    }

    return startDate;
  }

  /**
   * Get all pull requests for a user in a specific period
   */
  private async getAllPullRequestsInPeriod(
    username: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    const pullRequests: any[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const response = await this.octokit.search.issuesAndPullRequests({
          q: `author:${username} type:pr created:${startDate.toISOString().split('T')[0]}..${endDate.toISOString().split('T')[0]}`,
          sort: 'created',
          order: 'desc',
          page,
          per_page: perPage
        });

        if (response.data.items.length === 0) {
          break;
        }

        pullRequests.push(...response.data.items);

        // If we got fewer results than per_page, we're done
        if (response.data.items.length < perPage) {
          break;
        }

        page++;
      }
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      throw error;
    }

    return pullRequests;
  }

  /**
   * Group pull requests by date
   */
  private groupPullRequestsByDate(pullRequests: any[]): Record<string, any[]> {
    const prsByDate: Record<string, any[]> = {};

    for (const pr of pullRequests) {
      const date = pr.created_at.split('T')[0]; // Get YYYY-MM-DD format
      if (!prsByDate[date]) {
        prsByDate[date] = [];
      }
      prsByDate[date].push(pr);
    }

    return prsByDate;
  }

  /**
   * Generate weekly data structure for the habit tracker
   */
  private generateWeeklyData(
    startDate: Date,
    endDate: Date,
    prsByDate: Record<string, any[]>
  ): HabitTrackerWeekData[] {
    const weeks: HabitTrackerWeekData[] = [];
    const currentDate = new Date(startDate);

    // Start from the beginning of the week containing startDate
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    let weekStart = new Date(startOfWeek);

    while (weekStart <= endDate) {
      const days: HabitTrackerDayData[] = [];

      // Generate 7 days for this week
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);

        const dateStr = dayDate.toISOString().split('T')[0];
        const dayPRs = prsByDate[dateStr] || [];

        days.push({
          date: dateStr,
          count: dayPRs.length,
          pullRequests: dayPRs.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            repository: pr.repository_url.split('/').slice(-2).join('/'),
            state: pr.state === 'open' ? 'open' : pr.pull_request?.merged_at ? 'merged' : 'closed',
            html_url: pr.html_url
          }))
        });
      }

      weeks.push({ days });

      // Move to next week
      weekStart.setDate(weekStart.getDate() + 7);
    }

    return weeks;
  }
}