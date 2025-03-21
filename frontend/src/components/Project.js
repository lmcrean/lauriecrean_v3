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
export default function Project({ projectData }) {
  if (!projectData) {
    console.error('Project data not provided');
    return null;
  }
  
  const { 
    id, 
    name, 
    version, 
    versions,
    description, 
    technologies, 
    projectTypes,
    testResults,
    commitId, 
    githubInfo,
    buttons,
    slides 
  } = projectData;

  // Render a specific version of the project
  const renderVersion = (versionData, isFirst = false, isLast = false) => {
    return (
      <div className={`project-version ${isFirst ? 'first-version' : ''} ${isLast ? 'last-version' : ''}`}>
        {versions && versions.length > 1 && (
          <center>
            <b>version {versionData.version}</b>
          </center>
        )}
        
        {/* Buttons */}
        <div className="project-buttons">
          {versionData.buttons?.code && (
            <a href={versionData.buttons.code.url} target="_blank" rel="noopener noreferrer">
              <button className="code-btn">
                <i className={`fa ${versionData.buttons.code.icon}`}></i> {versionData.buttons.code.text}
              </button>
            </a>
          )}
          
          {versionData.buttons?.readme && (
            <a href={versionData.buttons.readme.url} target="_blank" rel="noopener noreferrer">
              <button className="readme-btn">
                <i className={`fa ${versionData.buttons.readme.icon}`}></i> {versionData.buttons.readme.text}
              </button>
            </a>
          )}
          
          {versionData.buttons?.figma && (
            <a href={versionData.buttons.figma.url} target="_blank" rel="noopener noreferrer">
              <button className="figma-btn">
                <i className={`fa ${versionData.buttons.figma.icon}`}></i> {versionData.buttons.figma.text}
              </button>
            </a>
          )}
          
          {versionData.buttons?.liveDemo && (
            <a href={versionData.buttons.liveDemo.url} target="_blank" rel="noopener noreferrer">
              <button className="live-demo-btn">
                <i className={`fa ${versionData.buttons.liveDemo.icon}`}></i> {versionData.buttons.liveDemo.text}
              </button>
            </a>
          )}
        </div>
        
        {/* GitHub badges */}
        {versionData.githubInfo && (
          <div className="github-badges">
            {versionData.githubInfo.lastCommit && (
              <a href={`https://github.com/${versionData.githubInfo.repo}`} target="_blank" rel="noopener noreferrer">
                <img 
                  src={`https://img.shields.io/github/last-commit/${versionData.githubInfo.repo}?color=blue`} 
                  alt="Last Commit" 
                />
              </a>
            )}
            
            {versionData.githubInfo.createdAt && (
              <img 
                src={`https://img.shields.io/github/created-at/${versionData.githubInfo.repo}?color=blue`} 
                alt="Created at" 
              />
            )}
            
            {versionData.githubInfo.commitActivity && (
              <a href={`https://github.com/${versionData.githubInfo.repo}/commits/main`} target="_blank" rel="noopener noreferrer">
                <img 
                  src={`https://img.shields.io/github/commit-activity/t/${versionData.githubInfo.repo}?color=blue`} 
                  alt="Commit Activity" 
                />
              </a>
            )}
          </div>
        )}
        
        {/* Technology badges */}
        <div className="technology-badges">
          {versionData.technologies?.map((tech, index) => (
            <img 
              key={`${id}-tech-${index}-${versionData.version}`}
              src={`https://img.shields.io/badge/${tech.replace(/\./g, '_').replace(/#/g, '_Sharp_').replace(/\+/g, '_Plus_')}-1C1C1C?&logo=${tech.toLowerCase()}&logoColor=white`}
              alt={tech}
            />
          ))}
          
          {/* Testing badges */}
          {versionData.testResults?.map((test, index) => (
            <img 
              key={`${id}-test-${index}-${versionData.version}`}
              src={`https://img.shields.io/badge/${test.framework}-${test.passed}_Passed-blue?style=flat-square&logo=${test.logo}&logoColor=white`}
              alt={`${test.framework} ${test.passed} Passed`}
            />
          ))}
        </div>
        
        {/* Description */}
        <div className="project-description" dangerouslySetInnerHTML={{ __html: versionData.description }} />
        
        {/* Separator between versions */}
        {!isLast && versions && versions.length > 1 && <hr />}
      </div>
    );
  };
  
  return (
    <div className="project-container" data-testid={id}>
      {/* Project Header */}
      <h2 className="project-title">{name}</h2>
      
      {/* Project Type Badges */}
      {projectTypes && (
        <div className="project-type-badges">
          {projectTypes.map((type, index) => (
            <img 
              key={`${id}-type-${index}`}
              src={`https://img.shields.io/badge/${type}-1C1C1C`}
              alt={type}
            />
          ))}
        </div>
      )}
      
      <section className="responsive-one-to-two-columns">
        {/* Project Carousel */}
        {slides && <ProjectCarousel projectKey={projectData.id.replace('-project', '')} />}
        
        <section>
          {/* Single version project */}
          {!versions && (
            <div className="project-content">
              {/* Buttons */}
              <div className="project-buttons">
                {buttons?.code && (
                  <a href={buttons.code.url} target="_blank" rel="noopener noreferrer">
                    <button className="code-btn">
                      <i className={`fa ${buttons.code.icon}`}></i> {buttons.code.text}
                    </button>
                  </a>
                )}
                
                {buttons?.readme && (
                  <a href={buttons.readme.url} target="_blank" rel="noopener noreferrer">
                    <button className="readme-btn">
                      <i className={`fa ${buttons.readme.icon}`}></i> {buttons.readme.text}
                    </button>
                  </a>
                )}
                
                {buttons?.figma && (
                  <a href={buttons.figma.url} target="_blank" rel="noopener noreferrer">
                    <button className="figma-btn">
                      <i className={`fa ${buttons.figma.icon}`}></i> {buttons.figma.text}
                    </button>
                  </a>
                )}
                
                {buttons?.liveDemo && (
                  <a href={buttons.liveDemo.url} target="_blank" rel="noopener noreferrer">
                    <button className="live-demo-btn">
                      <i className={`fa ${buttons.liveDemo.icon}`}></i> {buttons.liveDemo.text}
                    </button>
                  </a>
                )}
              </div>
              
              {/* GitHub badges */}
              {githubInfo && (
                <div className="github-badges">
                  {githubInfo.lastCommit && (
                    <a href={`https://github.com/${githubInfo.repo}`} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={`https://img.shields.io/github/last-commit/${githubInfo.repo}?color=blue`} 
                        alt="Last Commit" 
                      />
                    </a>
                  )}
                  
                  {githubInfo.createdAt && (
                    <img 
                      src={`https://img.shields.io/github/created-at/${githubInfo.repo}?color=blue`} 
                      alt="Created at" 
                    />
                  )}
                  
                  {githubInfo.commitActivity && (
                    <a href={`https://github.com/${githubInfo.repo}/commits/main`} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={`https://img.shields.io/github/commit-activity/t/${githubInfo.repo}?color=blue`} 
                        alt="Commit Activity" 
                      />
                    </a>
                  )}
                </div>
              )}
              
              {/* Technology badges */}
              <div className="technology-badges">
                {technologies?.map((tech, index) => (
                  <img 
                    key={`${id}-tech-${index}`}
                    src={`https://img.shields.io/badge/${tech.replace(/\./g, '_').replace(/#/g, '_Sharp_').replace(/\+/g, '_Plus_')}-1C1C1C?&logo=${tech.toLowerCase()}&logoColor=white`}
                    alt={tech}
                  />
                ))}
                
                {/* Testing badges */}
                {testResults?.map((test, index) => (
                  <img 
                    key={`${id}-test-${index}`}
                    src={`https://img.shields.io/badge/${test.framework}-${test.passed}_Passed-blue?style=flat-square&logo=${test.logo}&logoColor=white`}
                    alt={`${test.framework} ${test.passed} Passed`}
                  />
                ))}
              </div>
              
              {/* Description */}
              <div className="project-description" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}
          
          {/* Multiple versions project */}
          {versions && versions.map((versionData, index) => (
            <div key={`${id}-version-${versionData.version}`}>
              {renderVersion(
                versionData, 
                index === 0, 
                index === versions.length - 1
              )}
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}

Project.propTypes = {
  projectData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string,
    versions: PropTypes.arrayOf(
      PropTypes.shape({
        version: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
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
        buttons: PropTypes.objectOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          })
        )
      })
    ),
    description: PropTypes.string,
    projectTypes: PropTypes.arrayOf(PropTypes.string),
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
      repo: PropTypes.string,
      lastCommit: PropTypes.bool,
      createdAt: PropTypes.bool,
      commitActivity: PropTypes.bool
    }),
    buttons: PropTypes.objectOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
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