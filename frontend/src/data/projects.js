/**
 * Projects Data
 * This file contains the configuration for all projects
 */

// Import existing slides data
import projectCarousels from './projectCarousels';

const projects = {
  odyssey: {
    id: 'odyssey-project',
    name: 'Odyssey',
    projectTypes: ['Full-Stack', 'API'],
    description: 'Developed Social Media application with Auth, messaging and media sharing features • Unified API and Frontend into a singular repository to improve security standards and ensure compatibility with Safari browsers • Integrated Cloudinary media storage; improved performance with cached rendering • 78 automated tests across four testing frameworks (see above) including comprehensive alert feeback • integrated automatic testing screenshots for enhanced insights into frontend alerts • OAuth2/JWT authentication • Automated Heroku deployments through CLI • integrated customised SVG logo • integrated dark mode toggle with animated transition  • customised highly responsive Navbar for each device size, including popout menu for further options',
    technologies: [
      'Python',
      'React',
      'TailwindCSS',
      'Vercel',
      'Cloudinary',
      'PostgreSQL',
      'Django',
      'AWS',
      'Heroku',
      'OAuth2',
      'JWT',
      'Render'
    ],
    testResults: [
      { framework: 'Playwright', passed: 32, logo: 'playwright' },
      { framework: 'Jest', passed: 5, logo: 'jest' },
      { framework: 'Cypress', passed: 3, logo: 'cypress' },
      { framework: 'Python', passed: 38, logo: 'python' },
      { framework: 'Pytest', passed: 20, logo: 'pytest' }
    ],
    commitId: 'a7b9c2d',
    githubInfo: {
      repo: 'lmcrean/odyssey-api',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/odyssey-api',
        icon: 'fa-code',
        text: 'code'
      },
      readme: {
        url: 'https://odyssey-docs.lauriecrean.dev',
        icon: 'fa-book',
        text: 'readme'
      },
      figma: {
        url: 'https://www.figma.com/design/E9mOo72sSEqIjSplAMipFE/Odyssey?node-id=0-1&t=90jvE8D1JwHqgqVY-1',
        icon: 'fa-paint-brush',
        text: 'mockup'
      },
      liveDemo: {
        url: 'https://odyssey.lauriecrean.dev',
        icon: 'fa-play',
        text: 'live demo'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/odyssey.png',
        alt: 'Odyssey Screenshot'
      },
      {
        src: '/docs/screenshots/odyssey-E.png',
        alt: 'Odyssey Screenshot'
      },
      {
        src: '/docs/screenshots/odyssey-D.png',
        alt: 'Odyssey Screenshot D'
      },
      {
        src: '/docs/screenshots/odyssey-A.png',
        alt: 'Odyssey Screenshot A'
      },
      {
        src: '/docs/screenshots/odyssey-B.png',
        alt: 'Odyssey Screenshot B'
      },
      {
        src: '/docs/screenshots/odyssey-C.png',
        alt: 'Odyssey Screenshot C'
      }
    ]
  },
  
  coachmatrix: {
    id: 'coachmatrix-project',
    name: 'Coach Matrix',
    projectTypes: ['Full-Stack', 'AI'],
    description: 'Built a cutting-edge platform integrating Claude and OpenAI large language models from scratch • Set up automatic OpenAI embedding vector generation using prompts • Implemented vector and traditional search for the database • Created a responsive dashboard with live search for filtering • Added real-time notifications and status updates to enhance user experience',
    technologies: [
      'React',
      'NodeJS',
      'Express', 
      'MongoDB',
      'AWS',
      'Netlify',
      'OpenAI',
      'Vector DB',
      'Claude AI'
    ],
    testResults: [
      { framework: 'Playwright', passed: 15, logo: 'playwright' },
      { framework: 'Jest', passed: 10, logo: 'jest' }
    ],
    githubInfo: {
      repo: 'lmcrean/coach-matrix',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/coach-matrix',
        icon: 'fa-code',
        text: 'code'
      },
      figma: {
        url: 'https://www.figma.com/file/1234567890/CoachMatrix',
        icon: 'fa-paint-brush',
        text: 'mockup'
      },
      liveDemo: {
        url: 'https://coachmatrix.app',
        icon: 'fa-play',
        text: 'live demo'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/coachmatrix1.png',
        alt: 'Coach Matrix Screenshot'
      },
      {
        src: '/docs/screenshots/coachmatrix2.png',
        alt: 'Coach Matrix Dashboard'
      }
    ]
  },
  
  steamreport: {
    id: 'steamreport-project',
    name: 'Steam Report',
    projectTypes: ['Backend', 'API'],
    description: 'Created a Node.js application that automatically pulls data from the Steam API • Implemented robust caching to minimize API calls • Built comprehensive analysis tools for gaming statistics • Added support for user authentication via Steam • Created exportable reports in multiple formats',
    technologies: [
      'NodeJS',
      'Express',
      'Steam API',
      'Redis',
      'Docker',
      'Chart.js',
      'GitHub Actions'
    ],
    testResults: [
      { framework: 'Jest', passed: 28, logo: 'jest' },
      { framework: 'Supertest', passed: 12, logo: 'supertest' }
    ],
    githubInfo: {
      repo: 'lmcrean/steam-report',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/steam-report',
        icon: 'fa-code',
        text: 'code'
      },
      readme: {
        url: 'https://github.com/lmcrean/steam-report#readme',
        icon: 'fa-book',
        text: 'readme'
      },
      liveDemo: {
        url: 'https://steamreport.dev',
        icon: 'fa-play',
        text: 'live demo'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/steamreport1.png',
        alt: 'Steam Report Dashboard'
      },
      {
        src: '/docs/screenshots/steamreport2.png',
        alt: 'Steam Report Analysis Page'
      }
    ]
  },
  
  buffalo: {
    id: 'buffalo-project',
    name: 'Buffalo',
    projectTypes: ['Frontend'],
    versions: [
      {
        version: '2.0',
        description: 'Completely redesigned Buffalo with a modern UI and improved architecture • Incorporated TypeScript for enhanced type safety • Implemented comprehensive test coverage with Jest and React Testing Library • Added support for multiple themes and accessibility features',
        technologies: [
          'React',
          'TypeScript',
          'Sass',
          'Storybook',
          'Jest',
          'RTL',
          'Webpack'
        ],
        testResults: [
          { framework: 'Jest', passed: 45, logo: 'jest' },
          { framework: 'RTL', passed: 30, logo: 'rtl' }
        ],
        githubInfo: {
          repo: 'lmcrean/buffalo-v2',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: {
            url: 'https://github.com/lmcrean/buffalo-v2',
            icon: 'fa-code',
            text: 'code'
          },
          figma: {
            url: 'https://www.figma.com/file/1234567890/Buffalo-v2',
            icon: 'fa-paint-brush',
            text: 'mockup'
          },
          liveDemo: {
            url: 'https://buffalo-v2.netlify.app',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      },
      {
        version: '1.0',
        description: 'Original Buffalo project, a responsive front-end framework for rapid prototyping • Built with JavaScript and CSS • Includes a comprehensive component library • Supports responsive layouts and animations',
        technologies: [
          'JavaScript',
          'CSS',
          'HTML',
          'Gulp',
          'jQuery'
        ],
        githubInfo: {
          repo: 'lmcrean/buffalo',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: {
            url: 'https://github.com/lmcrean/buffalo',
            icon: 'fa-code',
            text: 'code'
          },
          readme: {
            url: 'https://github.com/lmcrean/buffalo#readme',
            icon: 'fa-book',
            text: 'readme'
          }
        }
      }
    ],
    slides: [
      {
        src: '/docs/screenshots/buffalo.png',
        alt: 'Buffalo Screenshot'
      },
      {
        src: '/docs/screenshots/buffalo2.png',
        alt: 'Buffalo Components'
      },
      {
        src: '/docs/screenshots/buffalo3.png',
        alt: 'Buffalo Mobile View'
      },
      {
        src: '/docs/screenshots/buffalo4.png',
        alt: 'Buffalo Typography'
      },
      {
        src: '/docs/screenshots/buffalo5.png',
        alt: 'Buffalo Grid System'
      }
    ]
  },
  
  lauriecrean: {
    id: 'lauriecrean-project',
    name: 'Laurie Crean Portfolio',
    projectTypes: ['Frontend', 'Documentation'],
    description: 'Built this portfolio website using Docusaurus and React • Custom component system for presenting projects, skills and experience • Integrated automated testing and CI/CD pipeline • Custom syntax highlighting and documentation features • Optimized for performance and SEO',
    technologies: [
      'React',
      'Docusaurus',
      'MDX',
      'CSS',
      'GitHub Actions',
      'Jest',
      'Vercel'
    ],
    testResults: [
      { framework: 'Jest', passed: 25, logo: 'jest' },
      { framework: 'Lighthouse', passed: 95, logo: 'lighthouse' }
    ],
    githubInfo: {
      repo: 'lmcrean/lauriecrean',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/lauriecrean',
        icon: 'fa-code',
        text: 'code'
      },
      readme: {
        url: 'https://github.com/lmcrean/lauriecrean#readme',
        icon: 'fa-book',
        text: 'readme'
      },
      liveDemo: {
        url: 'https://lauriecrean.dev',
        icon: 'fa-play',
        text: 'live demo'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/portfolio1.png',
        alt: 'Portfolio Homepage'
      },
      {
        src: '/docs/screenshots/portfolio2.png',
        alt: 'Portfolio Projects Page'
      }
    ]
  },
  
  hoverboard: {
    id: 'hoverboard-project',
    name: 'Hoverboard',
    projectTypes: ['Game', 'Frontend'],
    description: 'Created an engaging browser-based game using vanilla JavaScript • Implemented physics simulation for hoverboard movement • Used the Canvas API for smooth rendering and animations • Added mobile controls with touch support • Implemented high score tracking with local storage',
    technologies: [
      'JavaScript',
      'HTML5 Canvas',
      'CSS',
      'LocalStorage API',
      'Responsive Design'
    ],
    testResults: [
      { framework: 'Jest', passed: 18, logo: 'jest' }
    ],
    githubInfo: {
      repo: 'lmcrean/hoverboard-game',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/hoverboard-game',
        icon: 'fa-code',
        text: 'code'
      },
      liveDemo: {
        url: 'https://hoverboard-game.netlify.app',
        icon: 'fa-play',
        text: 'live demo'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/hoverboard1.png',
        alt: 'Hoverboard Game Screenshot'
      },
      {
        src: '/docs/screenshots/hoverboard2.png',
        alt: 'Hoverboard High Scores'
      }
    ]
  },
  
  crocodilekingdom: {
    id: 'crocodilekingdom-project',
    name: 'Crocodile Kingdom',
    projectTypes: ['Mobile', 'Game'],
    description: 'Developed a mobile game using Unity and C# • Implemented complex game mechanics and AI for enemies • Created custom artwork and animations • Built cross-platform support for iOS and Android • Added in-app purchase integration and analytics',
    technologies: [
      'Unity',
      'C#',
      'Firebase',
      'iOS',
      'Android',
      'Blender',
      'Adobe Illustrator'
    ],
    testResults: [
      { framework: 'Unity Test', passed: 40, logo: 'unity' },
      { framework: 'Firebase', passed: 15, logo: 'firebase' }
    ],
    githubInfo: {
      repo: 'lmcrean/crocodile-kingdom',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    },
    buttons: {
      code: {
        url: 'https://github.com/lmcrean/crocodile-kingdom',
        icon: 'fa-code',
        text: 'code'
      },
      figma: {
        url: 'https://www.figma.com/file/1234567890/CrocodileKingdom',
        icon: 'fa-paint-brush',
        text: 'mockup'
      }
    },
    slides: [
      {
        src: '/docs/screenshots/crocodile1.png',
        alt: 'Crocodile Kingdom Gameplay'
      },
      {
        src: '/docs/screenshots/crocodile2.png',
        alt: 'Crocodile Kingdom Menu'
      }
    ]
  }
};

export default projects; 