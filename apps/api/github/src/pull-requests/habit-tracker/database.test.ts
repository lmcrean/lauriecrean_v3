import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HabitTrackerDatabase } from './database';
import { PullRequestHabitEntry } from './types';
import fs from 'fs';
import path from 'path';

describe('HabitTrackerDatabase', () => {
  let db: HabitTrackerDatabase;
  let testDbPath: string;

  beforeEach(() => {
    // Create a unique temporary database for each test
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    testDbPath = path.join(__dirname, `test-habit-tracker-${uniqueId}.db`);
    
    // Ensure the test database doesn't exist before creating
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    process.env.HABIT_TRACKER_DB_PATH = testDbPath;
    db = new HabitTrackerDatabase();
  });

  afterEach(() => {
    // Clean up database
    try {
      db.close();
    } catch (error) {
      // Ignore close errors
    }
    
    // Clean up the file
    try {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    } catch (error) {
      // Ignore file cleanup errors
    }
    
    delete process.env.HABIT_TRACKER_DB_PATH;
  });

  describe('upsertHabitEntry', () => {
    it('should insert a new habit entry', () => {
      const date = '2025-01-15';
      const count = 3;

      db.upsertHabitEntry(date, count);

      const entry = db.getHabitEntry(date);
      expect(entry).toBeDefined();
      expect(entry!.date).toBe(date);
      expect(entry!.pull_request_count).toBe(count);
      expect(entry!.last_updated).toBeDefined();
    });

    it('should update existing habit entry', () => {
      const date = '2025-01-15';
      const initialCount = 2;
      const updatedCount = 5;

      // Insert initial entry
      db.upsertHabitEntry(date, initialCount);
      const initialEntry = db.getHabitEntry(date);
      
      // Update entry
      db.upsertHabitEntry(date, updatedCount);
      const updatedEntry = db.getHabitEntry(date);

      expect(updatedEntry!.pull_request_count).toBe(updatedCount);
      expect(updatedEntry!.last_updated).not.toBe(initialEntry!.last_updated);
    });

    it('should handle zero count entries', () => {
      const date = '2025-01-15';
      const count = 0;

      db.upsertHabitEntry(date, count);

      const entry = db.getHabitEntry(date);
      expect(entry).toBeDefined();
      expect(entry!.pull_request_count).toBe(0);
    });
  });

  describe('getHabitEntry', () => {
    it('should return null for non-existent date', () => {
      const entry = db.getHabitEntry('2025-01-15');
      expect(entry).toBeNull();
    });

    it('should return correct entry for existing date', () => {
      const date = '2025-01-15';
      const count = 3;
      db.upsertHabitEntry(date, count);

      const entry = db.getHabitEntry(date);
      expect(entry).toBeDefined();
      expect(entry!.date).toBe(date);
      expect(entry!.pull_request_count).toBe(count);
    });
  });

  describe('getHabitEntries', () => {
    beforeEach(() => {
      // Insert test data
      db.upsertHabitEntry('2025-01-10', 1);
      db.upsertHabitEntry('2025-01-11', 2);
      db.upsertHabitEntry('2025-01-12', 0);
      db.upsertHabitEntry('2025-01-13', 3);
      db.upsertHabitEntry('2025-01-14', 1);
      db.upsertHabitEntry('2025-01-15', 2);
    });

    it('should return entries within date range', () => {
      const entries = db.getHabitEntries('2025-01-11', '2025-01-13');
      
      expect(entries).toHaveLength(3);
      expect(entries[0].date).toBe('2025-01-11');
      expect(entries[1].date).toBe('2025-01-12');
      expect(entries[2].date).toBe('2025-01-13');
    });

    it('should return empty array for invalid date range', () => {
      const entries = db.getHabitEntries('2025-01-20', '2025-01-25');
      expect(entries).toHaveLength(0);
    });

    it('should return entries sorted by date ascending', () => {
      const entries = db.getHabitEntries('2025-01-10', '2025-01-15');
      
      expect(entries).toHaveLength(6);
      for (let i = 1; i < entries.length; i++) {
        expect(entries[i].date >= entries[i-1].date).toBe(true);
      }
    });
  });

  describe('getStats', () => {
    it('should return zero stats for empty database', () => {
      const stats = db.getStats();
      
      expect(stats.total_days).toBe(0);
      expect(stats.total_pull_requests).toBe(0);
      expect(stats.average_per_day).toBe(0);
      expect(stats.max_in_single_day).toBe(0);
      expect(stats.current_streak).toBe(0);
      expect(stats.longest_streak).toBe(0);
    });

    it('should calculate correct basic stats', () => {
      db.upsertHabitEntry('2025-01-10', 2);
      db.upsertHabitEntry('2025-01-11', 3);
      db.upsertHabitEntry('2025-01-12', 1);
      db.upsertHabitEntry('2025-01-13', 5);

      const stats = db.getStats();
      
      expect(stats.total_days).toBe(4);
      expect(stats.total_pull_requests).toBe(11);
      expect(stats.average_per_day).toBe(2.75);
      expect(stats.max_in_single_day).toBe(5);
    });

    it('should calculate streaks correctly', () => {
      // Create a pattern: 2 days, gap, 3 days, gap, 1 day
      db.upsertHabitEntry('2025-01-10', 1);
      db.upsertHabitEntry('2025-01-11', 2);
      db.upsertHabitEntry('2025-01-12', 0); // gap
      db.upsertHabitEntry('2025-01-13', 1);
      db.upsertHabitEntry('2025-01-14', 1);
      db.upsertHabitEntry('2025-01-15', 2);
      db.upsertHabitEntry('2025-01-16', 0); // gap
      db.upsertHabitEntry('2025-01-17', 1); // current day (most recent)

      const stats = db.getStats();
      
      expect(stats.current_streak).toBe(1);
      expect(stats.longest_streak).toBe(3);
    });

    it('should handle zero count days in streak calculation', () => {
      db.upsertHabitEntry('2025-01-10', 1);
      db.upsertHabitEntry('2025-01-11', 0);
      db.upsertHabitEntry('2025-01-12', 1);

      const stats = db.getStats();
      
      expect(stats.current_streak).toBe(1);
      expect(stats.longest_streak).toBe(1);
    });
  });

  describe('streak calculation edge cases', () => {
    it('should handle single day with PRs', () => {
      db.upsertHabitEntry('2025-01-10', 1);

      const stats = db.getStats();
      expect(stats.current_streak).toBe(1);
      expect(stats.longest_streak).toBe(1);
    });

    it('should handle only zero count days', () => {
      db.upsertHabitEntry('2025-01-10', 0);
      db.upsertHabitEntry('2025-01-11', 0);
      db.upsertHabitEntry('2025-01-12', 0);

      const stats = db.getStats();
      expect(stats.current_streak).toBe(0);
      expect(stats.longest_streak).toBe(0);
    });
  });
});