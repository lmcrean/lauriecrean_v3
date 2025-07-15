export interface TechBadge {
  name: string;
  logo: string;
  color?: string;
  logoColor?: string;
}

export const TECH_BADGES: Record<string, TechBadge> = {
  // Languages
  typescript: { name: 'Typescript', logo: 'typescript' },
  javascript: { name: 'JavaScript', logo: 'javascript' },
  python: { name: 'Python', logo: 'python' },
  html: { name: 'HTML', logo: 'html5' },
  css: { name: 'CSS', logo: 'css3' },
  sql: { name: 'SQL', logo: 'sql' },

  // Frameworks & Libraries
  react: { name: 'React', logo: 'react' },
  nextjs: { name: 'Next.js', logo: 'next.js' },
  express: { name: 'Express', logo: 'express' },
  django: { name: 'Django_REST', logo: 'django' },
  tailwindcss: { name: 'TailwindCSS', logo: 'tailwind-css' },
  vite: { name: 'Vite', logo: 'vite' },
  docusaurus: { name: 'Docusaurus', logo: 'docusaurus' },
  framermotion: { name: 'FramerMotion', logo: 'framer' },

  // Databases
  knex: { name: 'Knex', logo: 'knex' },
  postgresql: { name: 'PostgreSQL', logo: 'postgresql' },
  dynamodb: { name: 'DynamoDB', logo: 'amazon' },
  amazonrds: { name: 'Amazon_RDS', logo: 'amazon' },

  // Testing
  supertest: { name: 'Supertest', logo: 'supertest' },
  jest: { name: 'Jest', logo: 'jest' },
  vitest: { name: 'Vitest', logo: 'vitest' },
  playwright: { name: 'Playwright', logo: 'playwright' },
  cypress: { name: 'Cypress', logo: 'cypress' },
  pytest: { name: 'Pytest', logo: 'pytest' },

  // Cloud & Deployment
  azure: { name: 'Azure', logo: 'windows' },
  azureappservices: { name: 'Azure_App_Services', logo: 'windows' },
  azuresql: { name: 'Azure_SQL', logo: 'windows' },
  aws: { name: 'AWS', logo: 'amazon' },
  lambda: { name: 'Lambda', logo: 'amazon' },
  vercel: { name: 'Vercel', logo: 'vercel' },
  heroku: { name: 'Heroku', logo: 'heroku' },
  githubpages: { name: 'Github_Pages', logo: 'github' },
  cloudinary: { name: 'Cloudinary', logo: 'cloudinary' },

  // Tools & Services
  nodejs: { name: 'Node.js', logo: 'node.js' },
  oauth2: { name: 'OAuth2', logo: 'oauth' },
  jwt: { name: 'JWT', logo: 'json-web-token' },
  figma: { name: 'Figma', logo: 'figma' },
  googlesheets: { name: 'Google_Sheets', logo: 'google-sheets' },
};

export const generateBadgeUrl = (
  techKey: string,
  baseColor: string = '1C1C1C',
  logoColor: string = 'white'
): { url: string; alt: string } => {
  const tech = TECH_BADGES[techKey.toLowerCase()];
  
  if (!tech) {
    // Fallback for unknown tech
    const fallbackName = techKey.charAt(0).toUpperCase() + techKey.slice(1);
    return {
      url: `https://img.shields.io/badge/${fallbackName}-${baseColor}?style=flat-square&logo=${techKey.toLowerCase()}&logoColor=${logoColor}`,
      alt: fallbackName
    };
  }

  const color = tech.color || baseColor;
  const logoColorFinal = tech.logoColor || logoColor;

  return {
    url: `https://img.shields.io/badge/${tech.name}-${color}?style=flat-square&logo=${tech.logo}&logoColor=${logoColorFinal}`,
    alt: tech.name.replace(/_/g, ' ')
  };
};
