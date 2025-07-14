import React, { useState, useEffect } from 'react';
import { HabitTrackerProps, HabitTrackerData } from '../../../../../shared/types/habit-tracker';
import HabitTrackerGrid from './HabitTrackerGrid';
import HabitTrackerTooltip from './HabitTrackerTooltip';
import { useHabitTrackerApi } from './hooks/useHabitTrackerApi';

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  username = 'lmcrean',
  period = 'last-year',
  className = ''
}) => {
  const [tooltipData, setTooltipData] = useState<{
    date: string;
    count: number;
    pullRequests: any[];
    position: { x: number; y: number };
  } | null>(null);

  const { data, loading, error, fetchData } = useHabitTrackerApi({
    username,
    period
  });

  useEffect(() => {
    fetchData();
  }, [username, period]);

  const handleDayHover = (dayData: any, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipData({
      date: dayData.date,
      count: dayData.count,
      pullRequests: dayData.pullRequests,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  };

  const handleDayLeave = () => {
    setTooltipData(null);
  };

  if (loading) {
    return (
      <div className={`habit-tracker-container ${className}`}>
        <div className="habit-tracker-header">
          <h3 className="habit-tracker-title">Pull Request Activity</h3>
          <div className="habit-tracker-legend">
            <span className="legend-text">Less</span>
            <div className="legend-squares">
              <div className="legend-square level-0"></div>
              <div className="legend-square level-1"></div>
              <div className="legend-square level-2"></div>
              <div className="legend-square level-3"></div>
              <div className="legend-square level-4"></div>
            </div>
            <span className="legend-text">More</span>
          </div>
        </div>
        <div className="habit-tracker-loading">
          <div className="loading-grid">
            {/* Skeleton loading grid */}
            {Array.from({ length: 52 }, (_, weekIndex) => (
              <div key={weekIndex} className="loading-week">
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div key={dayIndex} className="loading-day"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`habit-tracker-container ${className}`}>
        <div className="habit-tracker-header">
          <h3 className="habit-tracker-title">Pull Request Activity</h3>
        </div>
        <div className="habit-tracker-error">
          <p>Failed to load habit tracker data: {error}</p>
          <button onClick={fetchData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'last-year':
        return 'Last 12 months';
      case 'last-6-months':
        return 'Last 6 months';
      case 'last-3-months':
        return 'Last 3 months';
      default:
        return 'Last 12 months';
    }
  };

  return (
    <div className={`habit-tracker-container ${className}`}>
      <div className="habit-tracker-header">
        <h3 className="habit-tracker-title">Pull Request Activity</h3>
        <div className="habit-tracker-legend">
          <span className="legend-text">Less</span>
          <div className="legend-squares">
            <div className="legend-square level-0"></div>
            <div className="legend-square level-1"></div>
            <div className="legend-square level-2"></div>
            <div className="legend-square level-3"></div>
            <div className="legend-square level-4"></div>
          </div>
          <span className="legend-text">More</span>
        </div>
      </div>
      
      <HabitTrackerGrid
        data={data}
        onDayHover={handleDayHover}
        onDayLeave={handleDayLeave}
      />
      
      <div className="habit-tracker-summary">
        <p className="summary-text">
          <span className="summary-count">{data.totalPRs}</span> pull requests in {getPeriodText(period)}
        </p>
      </div>

      {tooltipData && (
        <HabitTrackerTooltip
          date={tooltipData.date}
          count={tooltipData.count}
          pullRequests={tooltipData.pullRequests}
          position={tooltipData.position}
        />
      )}
    </div>
  );
};

export default HabitTracker;