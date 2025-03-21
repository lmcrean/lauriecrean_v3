import React from 'react';
import projectCarousels from '../data/projectCarousels';

/**
 * ProjectCarousel Component
 * 
 * Renders a project carousel for the given project key
 * 
 * @param {Object} props
 * @param {string} props.projectKey - Key of the project from projectCarousels data
 * @returns {JSX.Element} The rendered carousel
 */
export default function ProjectCarousel({ projectKey }) {
  // Get project data from our central data store
  const projectData = projectCarousels[projectKey];
  
  // Handle missing project data
  if (!projectData) {
    console.error(`Project data not found for key: ${projectKey}`);
    return null;
  }
  
  const { id, label, slides } = projectData;
  
  return (
    <section className="splide" id={id} aria-label={label} data-splide-init="true">
      <div className="splide__track">
        <ul className="splide__list">
          {slides.map((slide, index) => (
            <li key={`${id}-slide-${index}`} className="splide__slide">
              <img src={slide.src} alt={slide.alt} />
            </li>
          ))}
        </ul>
      </div>
      <div className="my-carousel-progress">
        <div className="my-carousel-progress-bar"></div>
      </div>
    </section>
  );
} 