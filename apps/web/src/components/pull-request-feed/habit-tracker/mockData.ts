// Mock data for demo purposes
export const mockHabitTrackerData = {
  username: 'lmcrean',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  weeks: [
    {
      days: [
        {
          date: '2024-01-01',
          count: 0,
          pullRequests: []
        },
        {
          date: '2024-01-02',
          count: 2,
          pullRequests: [
            {
              id: 1,
              number: 123,
              title: 'Add new feature',
              repository: 'lmcrean/project-a',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/project-a/pull/123'
            },
            {
              id: 2,
              number: 124,
              title: 'Fix bug in component',
              repository: 'lmcrean/project-b',
              state: 'open',
              html_url: 'https://github.com/lmcrean/project-b/pull/124'
            }
          ]
        },
        {
          date: '2024-01-03',
          count: 1,
          pullRequests: [
            {
              id: 3,
              number: 125,
              title: 'Update documentation',
              repository: 'lmcrean/docs',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/docs/pull/125'
            }
          ]
        },
        {
          date: '2024-01-04',
          count: 0,
          pullRequests: []
        },
        {
          date: '2024-01-05',
          count: 3,
          pullRequests: [
            {
              id: 4,
              number: 126,
              title: 'Refactor API endpoint',
              repository: 'lmcrean/api',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/api/pull/126'
            },
            {
              id: 5,
              number: 127,
              title: 'Add test coverage',
              repository: 'lmcrean/project-a',
              state: 'closed',
              html_url: 'https://github.com/lmcrean/project-a/pull/127'
            },
            {
              id: 6,
              number: 128,
              title: 'Implement habit tracker',
              repository: 'lmcrean/portfolio',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/portfolio/pull/128'
            }
          ]
        },
        {
          date: '2024-01-06',
          count: 1,
          pullRequests: [
            {
              id: 7,
              number: 129,
              title: 'Update README',
              repository: 'lmcrean/project-c',
              state: 'open',
              html_url: 'https://github.com/lmcrean/project-c/pull/129'
            }
          ]
        },
        {
          date: '2024-01-07',
          count: 0,
          pullRequests: []
        }
      ]
    },
    // Add more weeks with varying data
    {
      days: [
        {
          date: '2024-01-08',
          count: 1,
          pullRequests: [
            {
              id: 8,
              number: 130,
              title: 'Fix CI/CD pipeline',
              repository: 'lmcrean/devops',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/devops/pull/130'
            }
          ]
        },
        {
          date: '2024-01-09',
          count: 0,
          pullRequests: []
        },
        {
          date: '2024-01-10',
          count: 2,
          pullRequests: [
            {
              id: 9,
              number: 131,
              title: 'Add responsive design',
              repository: 'lmcrean/frontend',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/frontend/pull/131'
            },
            {
              id: 10,
              number: 132,
              title: 'Optimize performance',
              repository: 'lmcrean/frontend',
              state: 'open',
              html_url: 'https://github.com/lmcrean/frontend/pull/132'
            }
          ]
        },
        {
          date: '2024-01-11',
          count: 1,
          pullRequests: [
            {
              id: 11,
              number: 133,
              title: 'Add dark mode',
              repository: 'lmcrean/ui-lib',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/ui-lib/pull/133'
            }
          ]
        },
        {
          date: '2024-01-12',
          count: 0,
          pullRequests: []
        },
        {
          date: '2024-01-13',
          count: 1,
          pullRequests: [
            {
              id: 12,
              number: 134,
              title: 'Security update',
              repository: 'lmcrean/security',
              state: 'merged',
              html_url: 'https://github.com/lmcrean/security/pull/134'
            }
          ]
        },
        {
          date: '2024-01-14',
          count: 0,
          pullRequests: []
        }
      ]
    },
    // Continue with more weeks to show a fuller picture
    ...generateMoreWeeks()
  ],
  totalPRs: 45,
  maxDailyPRs: 3
};

function generateMoreWeeks() {
  const weeks = [];
  const startDate = new Date('2024-01-15');
  
  for (let weekIndex = 0; weekIndex < 48; weekIndex++) {
    const week = {
      days: []
    };
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);
      
      // Generate realistic PR activity (more activity on weekdays)
      const isWeekday = date.getDay() >= 1 && date.getDay() <= 5;
      const activityChance = isWeekday ? 0.4 : 0.1;
      const count = Math.random() < activityChance ? 
        Math.floor(Math.random() * 3) + 1 : 0;
      
      const pullRequests = [];
      for (let i = 0; i < count; i++) {
        pullRequests.push({
          id: Math.random() * 1000,
          number: Math.floor(Math.random() * 200) + 100,
          title: `Sample PR ${i + 1}`,
          repository: `lmcrean/project-${String.fromCharCode(97 + Math.floor(Math.random() * 5))}`,
          state: Math.random() > 0.8 ? 'open' : Math.random() > 0.5 ? 'merged' : 'closed',
          html_url: `https://github.com/lmcrean/project/pull/${Math.floor(Math.random() * 200) + 100}`
        });
      }
      
      week.days.push({
        date: date.toISOString().split('T')[0],
        count,
        pullRequests
      });
    }
    
    weeks.push(week);
  }
  
  return weeks;
}