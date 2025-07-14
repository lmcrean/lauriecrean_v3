import React, { useState } from 'react';
import { HabitTrackerProps } from '../../../../../shared/types/habit-tracker';
import HabitTrackerGrid from './HabitTrackerGrid';
import HabitTrackerTooltip from './HabitTrackerTooltip';
import { mockHabitTrackerData } from './mockData';

export const HabitTrackerDemo: React.FC<HabitTrackerProps> = ({
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
        data={mockHabitTrackerData}
        onDayHover={handleDayHover}
        onDayLeave={handleDayLeave}
      />
      
      <div className="habit-tracker-summary">
        <p className="summary-text">
          <span className="summary-count">{mockHabitTrackerData.totalPRs}</span> pull requests in {getPeriodText(period)}
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

export default HabitTrackerDemo;