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

  // Generate a shield URL based on the GitHub repo and shield type
  const generateShieldUrl = (repo, shieldType) => {
    if (!repo) return null;
    
    switch (shieldType) {
      case 'lastCommit':
        return `https://img.shields.io/github/last-commit/${repo}?style=for-the-badge`;
      case 'createdAt':
        return `https://img.shields.io/github/created-at/${repo}?style=for-the-badge`;
      case 'commitActivity':
        return `https://img.shields.io/github/commit-activity/m/${repo}?style=for-the-badge`;
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
        className={`project-button ${buttonType}-btn`}
      >
        <i className={`fa ${icon}`}></i> {text}
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
              src={`/img/tech/${tech.toLowerCase()}.svg`} 
              alt={tech} 
              className="tech-badge" 
            />
          ))}
        </div>
        
        {/* Test result badges */}
        <div className="test-badges">
          {versionTestResults.map(test => (
            <img 
              key={test.framework} 
              src={`/img/test/${test.logo}.svg`} 
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
              src={`/img/project-type/${type.toLowerCase()}.svg`} 
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
                    src={`/img/tech/${tech.toLowerCase()}.svg`} 
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
                    src={`/img/test/${test.logo}.svg`} 
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