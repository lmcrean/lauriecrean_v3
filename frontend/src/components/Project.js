import React from 'react';
import PropTypes from 'prop-types';
import '../css/project.css';
import ProjectCarousel from './ProjectCarousel';

/**
 * Project Component
 * 
 * Renders a project with header, description, technologies, links and carousel
 * based on the structure in index.md
 * 
 * @param {Object} props
 * @param {Object} props.projectData - Project data from projects.js
 * @returns {JSX.Element} The rendered project
 */
const Project = ({ projectData }) => {
  const {
    id,
    name,
    projectTypes = [],
    description,
    technologies = [],
    testResults = [],
    githubInfo,
    buttons = {},
    versions,
    slides = []
  } = projectData;

  // Extract project key for carousel ID
  const projectKey = id.split('-')[0];

  // Helper function to get the correct logo name for shields.io
  const getLogoName = (tech) => {
    // Map technology names to their correct shields.io logo names
    const logoMap = {
      'NodeJS': 'node.js',
      'Node.js': 'node.js',
      'JavaScript': 'javascript',
      'JavaScript (ES6+)': 'javascript',
      'React': 'react',
      'React.js': 'react',
      'Express': 'express',
      'Express.js': 'express',
      'Chart.js': 'chart.js',
      'Docker': 'docker',
      'Redis': 'redis',
      'Python': 'python',
      'Django': 'django',
      'Django REST': 'django',
      'PostgreSQL': 'postgresql',
      'MySQL': 'mysql',
      'MongoDB': 'mongodb',
      'HTML': 'html5',
      'CSS': 'css3',
      'TailwindCSS': 'tailwind-css',
      'AWS': 'amazon-aws',
      'Lambda': 'aws-lambda',
      'Vercel': 'vercel',
      'Heroku': 'heroku',
      'Github Pages': 'github',
      'GitHub Actions': 'github-actions',
      'Steam API': 'steam',
      'JWT': 'json-web-token',
      'OAuth2': 'auth0',
      'Amazon RDS': 'amazon-aws',
      'API Gateway': 'amazon-api-gateway',
      'S3': 'amazon-s3',
      'DynamoDB': 'amazon-dynamodb',
      'Cloudinary': 'cloudinary',
      'Jest': 'jest',
      'Cypress': 'cypress',
      'Playwright': 'playwright',
      'Pytest': 'pytest',
      'Vitest': 'vitest',
      'Cognito': 'amazon-cognito',
      'GraphQL': 'graphql',
      'Next.js': 'next.js',
      'Vite': 'vite',
      'Docusaurus': 'docusaurus',
      'Amplify': 'aws-amplify'
    };
    
    return logoMap[tech] || tech.toLowerCase();
  };

  // Function to generate a badge URL
  const generateBadgeUrl = (label, value, color, logo = null, logoColor = 'white', style = null) => {
    // Encode parts for URL
    const encodedLabel = encodeURIComponent(label);
    const encodedValue = encodeURIComponent(value);
    
    let url = `https://img.shields.io/badge/${encodedLabel}-${encodedValue}?color=${color}`;
    
    if (logo) {
      url += `&logo=${encodeURIComponent(logo)}&logoColor=${logoColor}`;
    }
    
    if (style) {
      url += `&style=${style}`;
    }
    
    return url;
  };

  // Generate a shield URL based on the GitHub repo and shield type
  const generateShieldUrl = (repo, shieldType) => {
    if (!repo) return null;
    
    switch (shieldType) {
      case 'lastCommit':
        return `https://img.shields.io/github/last-commit/${repo}?color=blue`;
      case 'createdAt':
        return `https://img.shields.io/github/created-at/${repo}?color=blue`;
      case 'commitActivity':
        return `https://img.shields.io/github/commit-activity/t/${repo}?color=blue`;
      default:
        return null;
    }
  };

  // Function to render a single button
  const renderButton = (buttonType, buttonData) => {
    if (!buttonData || !buttonData.url) return null;
    
    const { url, icon, text } = buttonData;
    
    return (
      <a 
        key={buttonType} 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
      >
        <button className={`${buttonType}-btn`}>
          <i className={`fa ${icon}`}></i> {text}
        </button>
      </a>
    );
  };

  // Function to render a single version of the project
  const renderVersion = (versionData, index) => {
    const {
      version,
      description: versionDescription,
      technologies: versionTechnologies = [],
      testResults: versionTestResults = [],
      githubInfo: versionGithubInfo,
      buttons: versionButtons = {}
    } = versionData;

    return (
      <div key={`version-${index}`} className="project-version">
        <h3 className="version-title">version {version}</h3>
        
        {/* Version description */}
        <div 
          className="project-description" 
          dangerouslySetInnerHTML={{ __html: versionDescription }} 
        />
        
        {/* Technology badges */}
        <div className="tech-badges">
          {versionTechnologies.map(tech => (
            <img 
              key={tech} 
              src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} 
              alt={tech} 
              className="tech-badge" 
            />
          ))}
        </div>
        
        {/* Test result badges for the version */}
        <div className="test-badges">
          {versionTestResults.map(test => (
            <img 
              key={test.framework} 
              src={generateBadgeUrl(test.framework, `${test.passed}_Passed`, 'blue', getLogoName(test.framework), 'white', 'flat-square')} 
              alt={`${test.framework} ${test.passed} Passed`} 
              className="test-badge" 
            />
          ))}
        </div>
        
        {/* GitHub badges */}
        {versionGithubInfo && versionGithubInfo.repo && (
          <div className="github-badges">
            {versionGithubInfo.lastCommit && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'lastCommit')} 
                alt="Last Commit" 
                className="github-badge" 
              />
            )}
            {versionGithubInfo.createdAt && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'createdAt')} 
                alt="Created At" 
                className="github-badge" 
              />
            )}
            {versionGithubInfo.commitActivity && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'commitActivity')} 
                alt="Commit Activity" 
                className="github-badge" 
              />
            )}
          </div>
        )}
        
        {/* Version buttons */}
        <div className="project-buttons">
          {renderButton('code', versionButtons.code)}
          {renderButton('readme', versionButtons.readme)}
          {renderButton('figma', versionButtons.figma)}
          {renderButton('liveDemo', versionButtons.liveDemo)}
        </div>
      </div>
    );
  };

  return (
    <div className="project-container">
      {/* Project header with title and type badges */}
      <div className="project-header">
        <h2 className="project-title">{name}</h2>
        <div className="project-type-badges">
          {projectTypes.map(type => (
            <img 
              key={type} 
              src={generateBadgeUrl(type, '1C1C1C', '1C1C1C')} 
              alt={type} 
              className="project-type-badge" 
            />
          ))}
        </div>
      </div>
      
      {/* Single column layout */}
      <div className="project-content">
        {/* Project carousel */}
        <div className="project-carousel">
          <ProjectCarousel projectKey={projectKey} slides={slides} />
        </div>
        
        <div className="project-details">
          {/* If there are versions, render each version */}
          {versions ? (
            <div className="project-versions">
              {versions.map((version, index) => renderVersion(version, index))}
            </div>
          ) : (
            // Otherwise render the single project details
            <>
              {/* Project description */}
              <div 
                className="project-description" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
              
              {/* Technology badges */}
              <div className="tech-badges">
                {technologies.map(tech => (
                  <img 
                    key={tech} 
                    src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} 
                    alt={tech} 
                    className="tech-badge" 
                  />
                ))}
              </div>
              
              {/* Test result badges */}
              <div className="test-badges">
                {testResults.map(test => (
                  <img 
                    key={test.framework} 
                    src={generateBadgeUrl(test.framework, `${test.passed}_Passed`, 'blue', getLogoName(test.framework), 'white', 'flat-square')} 
                    alt={`${test.framework} ${test.passed} Passed`} 
                    className="test-badge" 
                  />
                ))}
              </div>
              
              {/* GitHub badges */}
              {githubInfo && githubInfo.repo && (
                <div className="github-badges">
                  {githubInfo.lastCommit && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'lastCommit')} 
                      alt="Last Commit" 
                      className="github-badge" 
                    />
                  )}
                  {githubInfo.createdAt && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'createdAt')} 
                      alt="Created At" 
                      className="github-badge" 
                    />
                  )}
                  {githubInfo.commitActivity && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'commitActivity')} 
                      alt="Commit Activity" 
                      className="github-badge" 
                    />
                  )}
                </div>
              )}
              
              {/* Project buttons */}
              <div className="project-buttons">
                {renderButton('code', buttons.code)}
                {renderButton('readme', buttons.readme)}
                {renderButton('figma', buttons.figma)}
                {renderButton('liveDemo', buttons.liveDemo)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Project.propTypes = {
  projectData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projectTypes: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
    testResults: PropTypes.arrayOf(
      PropTypes.shape({
        framework: PropTypes.string.isRequired,
        passed: PropTypes.number.isRequired,
        logo: PropTypes.string.isRequired
      })
    ),
    commitId: PropTypes.string,
    githubInfo: PropTypes.shape({
      repo: PropTypes.string.isRequired,
      lastCommit: PropTypes.bool,
      createdAt: PropTypes.bool,
      commitActivity: PropTypes.bool
    }),
    buttons: PropTypes.shape({
      code: PropTypes.shape({
        url: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      }),
      readme: PropTypes.shape({
        url: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      }),
      figma: PropTypes.shape({
        url: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      }),
      liveDemo: PropTypes.shape({
        url: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    }),
    versions: PropTypes.arrayOf(
      PropTypes.shape({
        version: PropTypes.string.isRequired,
        description: PropTypes.string,
        technologies: PropTypes.arrayOf(PropTypes.string),
        testResults: PropTypes.arrayOf(
          PropTypes.shape({
            framework: PropTypes.string.isRequired,
            passed: PropTypes.number.isRequired,
            logo: PropTypes.string.isRequired
          })
        ),
        githubInfo: PropTypes.shape({
          repo: PropTypes.string.isRequired,
          lastCommit: PropTypes.bool,
          createdAt: PropTypes.bool,
          commitActivity: PropTypes.bool
        }),
        buttons: PropTypes.shape({
          code: PropTypes.shape({
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          }),
          readme: PropTypes.shape({
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          }),
          figma: PropTypes.shape({
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          }),
          liveDemo: PropTypes.shape({
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          })
        })
      })
    ),
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

export default Project; 