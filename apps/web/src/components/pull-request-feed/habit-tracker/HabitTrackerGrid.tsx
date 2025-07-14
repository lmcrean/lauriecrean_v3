import React from 'react';
import { HabitTrackerData } from '../../../../../shared/types/habit-tracker';

interface HabitTrackerGridProps {
  data: HabitTrackerData;
  onDayHover: (dayData: any, event: React.MouseEvent) => void;
  onDayLeave: () => void;
}

const HabitTrackerGrid: React.FC<HabitTrackerGridProps> = ({
  data,
  onDayHover,
  onDayLeave
}) => {
  const getIntensityLevel = (count: number, maxCount: number): number => {
    if (count === 0) return 0;
    if (maxCount === 0) return 1;
    
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const getMonthLabels = () => {
    const labels: { month: string; left: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentMonth = -1;
    let weekIndex = 0;
    
    for (const week of data.weeks) {
      const firstDay = new Date(week.days[0].date);
      const month = firstDay.getMonth();
      
      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          month: monthNames[month],
          left: weekIndex * 14 + 1 // 14px per week including gap
        });
      }
      weekIndex++;
    }
    
    return labels;
  };

  const getDayLabels = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="habit-tracker-grid">
      {/* Month labels */}
      <div className="month-labels">
        {getMonthLabels().map(({ month, left }) => (
          <span 
            key={month} 
            className="month-label" 
            style={{ left: `${left}px` }}
          >
            {month}
          </span>
        ))}
      </div>
      
      {/* Main grid container */}
      <div className="grid-container">
        {/* Day labels */}
        <div className="day-labels">
          {getDayLabels().map((day, index) => (
            <span key={day} className={`day-label ${index % 2 === 0 ? 'visible' : 'hidden'}`}>
              {day}
            </span>
          ))}
        </div>
        
        {/* Grid */}
        <div className="weeks-grid">
          {data.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="week-column">
              {week.days.map((day, dayIndex) => {
                const level = getIntensityLevel(day.count, data.maxDailyPRs);
                const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={day.date}
                    className={`day-square level-${level} ${isToday ? 'today' : ''}`}
                    onMouseEnter={(e) => onDayHover(day, e)}
                    onMouseLeave={onDayLeave}
                    title={`${formatDate(day.date)}: ${day.count} pull request${day.count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitTrackerGrid;