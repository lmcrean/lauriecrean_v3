import React from 'react';

interface HabitTrackerTooltipProps {
  date: string;
  count: number;
  pullRequests: any[];
  position: { x: number; y: number };
}

const HabitTrackerTooltip: React.FC<HabitTrackerTooltipProps> = ({
  date,
  count,
  pullRequests,
  position
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTooltipStyle = () => {
    const tooltipWidth = 280;
    const tooltipHeight = Math.min(200, 60 + (pullRequests.length * 24));
    
    let left = position.x - tooltipWidth / 2;
    let top = position.y - tooltipHeight - 10;
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top < 10) top = position.y + 20;
    
    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      maxHeight: `${tooltipHeight}px`
    };
  };

  return (
    <div className="habit-tracker-tooltip" style={getTooltipStyle()}>
      <div className="tooltip-header">
        <div className="tooltip-date">{formatDate(date)}</div>
        <div className="tooltip-count">
          {count} pull request{count !== 1 ? 's' : ''}
        </div>
      </div>
      
      {pullRequests.length > 0 && (
        <div className="tooltip-prs">
          {pullRequests.slice(0, 5).map((pr) => (
            <div key={pr.id} className="tooltip-pr">
              <div className={`pr-status ${pr.state}`}></div>
              <div className="pr-info">
                <div className="pr-title">{pr.title}</div>
                <div className="pr-repo">{pr.repository}</div>
              </div>
            </div>
          ))}
          {pullRequests.length > 5 && (
            <div className="tooltip-more">
              +{pullRequests.length - 5} more pull request{pullRequests.length - 5 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitTrackerTooltip;