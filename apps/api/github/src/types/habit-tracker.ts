// Habit tracker types for API
export interface HabitTrackerDayData {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number; // Number of PRs created on this day
  pullRequests: {
    id: number;
    number: number;
    title: string;
    repository: string;
    state: 'open' | 'closed' | 'merged';
    html_url: string;
  }[];
}

export interface HabitTrackerWeekData {
  days: HabitTrackerDayData[];
}

export interface HabitTrackerData {
  username: string;
  startDate: string; // ISO date string for the start of the period
  endDate: string; // ISO date string for the end of the period
  weeks: HabitTrackerWeekData[];
  totalPRs: number;
  maxDailyPRs: number; // Max PRs in a single day for scaling colors
}

export interface HabitTrackerApiResponse {
  data: HabitTrackerData;
  meta: {
    username: string;
    period: string; // e.g., "last-year", "last-6-months"
    generated_at: string; // ISO timestamp
  };
}