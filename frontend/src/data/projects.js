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
    version: '2.3.0',
    description: 'Developed Social Media application with Auth, messaging and media sharing features • Unified API and Frontend into a singular repository to improve security standards and ensure compatibility with Safari browsers • Integrated Cloudinary media storage; improved performance with cached rendering • 78 automated tests across four testing frameworks (see above) including comprehensive alert feeback • integrated automatic testing screenshots for enhanced insights into frontend alerts • OAuth2/JWT authentication • Automated Heroku deployments through CLI • integrated customised SVG logo • integrated dark mode toggle with animated transition  • customised highly responsive Navbar for each device size, including popout menu for further options',
    projectTypes: ['Full-Stack', 'API'],
    technologies: [
      'Python', 'React', 'TailwindCSS', 'Vercel', 'Cloudinary', 'PostgreSQL', 
      'Django', 'AWS', 'Heroku', 'OAuth2', 'JWT', 'Amazon RDS'
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
      },
    },
    slides: projectCarousels.odyssey.slides
  },
  
  coachmatrix: {
    id: 'coachmatrix-project',
    name: 'Coach Matrix',
    version: '1.5.2',
    description: 'Social platform focused on professional development • Custom authentication and permission system • OAuth2/JWT authentication • Content voting and ranking algorithm with Python • Automated Heroku deployment pipeline  • enhanced frontend animations with video landing and customised CSS logo',
    projectTypes: ['Full-Stack', 'API'],
    technologies: [
      'JavaScript', 'Python', 'HTML', 'CSS', 'PostgreSQL', 'Django', 
      'Amazon RDS', 'AWS', 'OAuth2', 'JWT', 'Heroku'
    ],
    testResults: [
      { framework: 'Playwright', passed: 3, logo: 'playwright' },
      { framework: 'Python', passed: 4, logo: 'python' },
      { framework: 'Pytest', passed: 6, logo: 'pytest' }
    ],
    commitId: 'e3f5g7h',
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
      readme: { 
        url: 'https://github.com/lmcrean/coach-matrix',
        icon: 'fa-book',
        text: 'readme'
      },
      figma: { 
        url: 'https://www.figma.com/design/jXT4Bi1WXVwYG4daO3Yczi/Coach-Matrix?node-id=1-89&t=J0AI0eKKLWvVg5Lj-1',
        icon: 'fa-paint-brush',
        text: 'mockup'
      },
      liveDemo: { 
        url: 'https://coach-matrix-d2cd1e717f81.herokuapp.com/',
        icon: 'fa-play',
        text: 'live demo'
      },
    },
    slides: projectCarousels.coachmatrix.slides
  },
  
  steamreport: {
    id: 'steamreport-project',
    name: 'Steam Report',
    versions: [
      {
        version: '2.0',
        description: 'Implemented data aggregation system for career pathway analysis •  Achieved 100% test coverage (12 Playwright E2E, 2 Jest unit tests) • Architected scalable web client with React and Express.js • Implemented serverless backend using AWS Lambda and S3, reducing hosting costs • Built responsive UI with TailwindCSS improving mobile engagement • CI/CD pipeline with Vercel enabling automated deployments',
        technologies: [
          'React', 'Next.js', 'TailwindCSS', 'JavaScript', 'Vite',
          'AWS', 'Lambda', 'DynamoDB', 'Express', 'Vercel'
        ],
        testResults: [
          { framework: 'Playwright', passed: 12, logo: 'playwright' },
          { framework: 'Jest', passed: 2, logo: 'jest' },
          { framework: 'Vitest', passed: 19, logo: 'vitest' }
        ],
        commitId: 'i9j8k7l',
        githubInfo: {
          repo: 'lmcrean/steam-report-mern',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/steam-report-mern',
            icon: 'fa-code',
            text: 'code'
          },
          readme: { 
            url: 'https://steamreport-docs.lauriecrean.dev',
            icon: 'fa-book',
            text: 'readme'
          },
          figma: { 
            url: 'https://www.figma.com/design/r3srLkPpbnMviUOIZeNjk7/Steam-Report?node-id=0-1&t=FBS5ZDxiWmtVBPeq-1',
            icon: 'fa-paint-brush',
            text: 'mockup'
          },
          liveDemo: { 
            url: 'https://steamreport.lauriecrean.dev',
            icon: 'fa-play',
            text: 'live demo'
          },
        }
      },
      {
        version: '1.0',
        description: 'Implemented data aggregation system for career pathway analysis • Built Python/Node.js application integrating multiple external APIs including Google Sheets • Automated data collection and processing pipeline • Maintained code quality with PEP8 standards and comprehensive manual testing • Deployed on Heroku with continuous integration',
        technologies: [
          'Python', 'Node.js', 'Heroku', 'Google Sheets'
        ],
        commitId: 'i9j8k7l',
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
            url: 'https://github.com/lmcrean/steam-report',
            icon: 'fa-book',
            text: 'readme'
          },
          liveDemo: { 
            url: 'https://steam-report-4c5b92c32ae5.herokuapp.com/',
            icon: 'fa-play',
            text: 'live demo'
          },
        }
      }
    ],
    projectTypes: ['Full-Stack', 'API'],
    slides: projectCarousels.steamreport.slides
  },
  
  buffalo: {
    id: 'buffalo-project',
    name: 'Buffalo',
    versions: [
      {
        version: '2.0',
        description: 'Developed an AWS authentication feature running on Amplify though TDD. Migrated version 1.0 to a more efficent framework in unified AWS ecosystem. Established robust test coverage with Vitest for unit tests and Playwright for E2E tests.',
        technologies: [
          'Amplify', 'React', 'TailwindCSS', 'Vite', 'GraphQL', 'Cognito', 'S3'
        ],
        testResults: [
          { framework: 'Playwright', passed: 12, logo: 'playwright' },
          { framework: 'Vitest', passed: 67, logo: 'vitest' }
        ],
        commitId: 'm6n4o2p',
        githubInfo: {
          repo: 'lmcrean/odyssey-v2-amplify-vite',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/odyssey-v2-amplify-vite',
            icon: 'fa-code',
            text: 'code'
          },
          liveDemo: { 
            url: 'https://main.d1l70uc5e2kcii.amplifyapp.com/',
            icon: 'fa-play',
            text: 'live demo'
          },
        }
      },
      {
        version: '1.0',
        description: 'Moved [Odyssey API](https://github.com/lmcrean/odyssey-api) from Python-Cloudinary-Django to a unified backend pipeline with AWS Lambda, DynamoDB, API Gateway, S3 and CloudFront. • Infused JWT layer and websocket connection • Improved python test code quality with vertical framework. Eventually developed into [AWS authentication feature](#aws-authentication-feature).',
        technologies: [
          'AWS', 'Lambda', 'DynamoDB', 'API Gateway', 'S3', 'Python', 'Django', 'JWT'
        ],
        testResults: [
          { framework: 'Python', passed: 7, logo: 'python' }
        ],
        commitId: 'm6n4o2p',
        githubInfo: {
          repo: 'lmcrean/odyssey-v2',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/odyssey-v2',
            icon: 'fa-code',
            text: 'code'
          }
        }
      }
    ],
    projectTypes: ['Full-Stack', 'API'],
    slides: projectCarousels.buffalo.slides
  },
  
  lauriecrean: {
    id: 'lauriecrean-project',
    name: 'Laurie Crean Portfolio',
    versions: [
      {
        version: '3.0',
        description: '',
        technologies: [
          'Docusaurus'
        ],
        testResults: [
          { framework: 'Vitest', passed: 33, logo: 'vitest' },
          { framework: 'Playwright', passed: 12, logo: 'playwright' }
        ],
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/lauriecrean_nextjs',
            icon: 'fa-code',
            text: 'code'
          },
          liveDemo: { 
            url: 'https://lauriecrean.dev',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      },
      {
        version: '2.0',
        description: 'Simplified project with Docsify framework for converting markdown to HTML, CSS and Javascript, providing better maintainability.',
        technologies: [
          'Docsify.js', 'HTML', 'CSS', 'JavaScript', 'Github Pages'
        ],
        githubInfo: {
          repo: 'lmcrean/lauriecrean_nextjs',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        }
      },
      {
        version: '1.0',
        description: 'Dynamic animations with Framer Motion • integrated Vercel deployment pipeline',
        technologies: [
          'JavaScript', 'React', 'Next.js', 'TailwindCSS', 'FramerMotion', 'Vercel'
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
          liveDemo: { 
            url: 'https://lauriecrean-nextjs-dlpcywpcu-lmcreans-projects.vercel.app/',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      }
    ],
    slides: projectCarousels.lauriecrean.slides
  },
  
  hoverboard: {
    id: 'hoverboard-project',
    name: 'Hoverboard',
    projectTypes: ['Frontend'],
    versions: [
      {
        version: '2.0',
        description: 'Ported HTML CSS to React • Integrated TailwindCSS into workflow for more efficient styling • integrated Vercel deployment pipeline',
        technologies: [
          'JavaScript', 'React', 'Next.js', 'TailwindCSS', 'Vercel', 'Figma'
        ],
        githubInfo: {
          repo: 'lmcrean/hoverboard-react',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/hoverboard-react',
            icon: 'fa-code',
            text: 'code'
          },
          liveDemo: { 
            url: 'https://hoverboard-react.vercel.app/',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      },
      {
        version: '1.0',
        description: 'Developed Responsive website with HTML and CSS • enhanced for all device sizes with CSS-Grid and Flexbox methods • enhanced design with Figma template',
        technologies: [
          'JavaScript', 'HTML', 'CSS', 'Github Pages', 'Figma'
        ],
        githubInfo: {
          repo: 'lmcrean/hoverboard',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/hoverboard',
            icon: 'fa-code',
            text: 'code'
          },
          readme: { 
            url: 'https://github.com/lmcrean/hoverboard',
            icon: 'fa-book',
            text: 'readme'
          },
          figma: { 
            url: 'https://www.figma.com/design/W7mEdTvxLgNZTvh1ODiuwD/HOVERBOARD?node-id=0-1&t=KLNqBhNcdgTvlq8M-1',
            icon: 'fa-paint-brush',
            text: 'mockup'
          },
          liveDemo: { 
            url: 'https://lmcrean.github.io/Hoverboard/',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      }
    ],
    slides: projectCarousels.hoverboard.slides
  },
  
  crocodilekingdom: {
    id: 'crocodilekingdom-project',
    name: 'Crocodile Kingdom',
    projectTypes: ['Frontend', 'LocalStorage'],
    versions: [
      {
        version: '2.0',
        description: 'Refined gameplay logic to creative word association game with validation • Ported essential Javascript features into React • Integrated Tailwind CSS into workflow.',
        technologies: [
          'JavaScript', 'React', 'TailwindCSS', 'Vercel'
        ],
        testResults: [
          { framework: 'Vitest', passed: 53, logo: 'vitest' }
        ],
        githubInfo: {
          repo: 'lmcrean/crocodile-kingdom-mern',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        },
        buttons: {
          code: { 
            url: 'https://github.com/lmcrean/crocodile-kingdom-mern',
            icon: 'fa-code',
            text: 'code'
          },
          liveDemo: { 
            url: 'https://crocodilekingdom.lauriecrean.dev/',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      },
      {
        version: '1.0',
        description: 'Developed Memory game with Javascript • dynamic progress bar to track progress • used LocalStorage to save high scores',
        technologies: [
          'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Github Pages'
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
          readme: { 
            url: 'https://github.com/lmcrean/crocodile-kingdom',
            icon: 'fa-book',
            text: 'readme'
          },
          liveDemo: { 
            url: 'https://lmcrean.github.io/Crocodile-Kingdom/',
            icon: 'fa-play',
            text: 'live demo'
          }
        }
      }
    ],
    slides: projectCarousels.crocodilekingdom.slides
  }
};

export default projects; 