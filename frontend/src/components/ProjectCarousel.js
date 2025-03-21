import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '@splidejs/splide/dist/css/splide.min.css';
import '../css/projectCarousel.css';

/**
 * ProjectCarousel Component
 * 
 * Renders a project carousel for the given project key
 * 
 * @param {Object} props
 * @param {string} props.projectKey - Key of the project from projectCarousels data
 * @param {Array} props.slides - Array of slide objects
 * @returns {JSX.Element} The rendered carousel
 */
const ProjectCarousel = ({ projectKey, slides }) => {
  const splideRef = useRef(null);
  
  useEffect(() => {
    // Dynamically import Splide to avoid SSR issues
    import('@splidejs/splide').then(({ Splide }) => {
      if (splideRef.current) {
        // Initialize Splide only if it hasn't been initialized yet
        if (!splideRef.current.classList.contains('is-initialized')) {
          const splide = new Splide(splideRef.current, {
            type: 'loop',
            perPage: 1,
            autoplay: true,
            pauseOnHover: true,
            interval: 5000,
            pagination: true,
            arrows: true,
            height: 'auto',
            gap: '1rem',
          });
          
          splide.mount();
        }
      }
    });
    
    // Cleanup function
    return () => {
      if (splideRef.current && splideRef.current.classList.contains('is-initialized')) {
        // If we had a direct reference to the Splide instance, we could call destroy()
        // Since we don't keep that reference, we rely on the DOM cleanup
      }
    };
  }, [slides]); // Re-initialize when slides change

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="splide-container">
      <div 
        className="splide" 
        ref={splideRef}
        id={`project-carousel-${projectKey}`}
      >
        <div className="splide__track">
          <ul className="splide__list">
            {slides.map((slide, index) => (
              <li key={`${projectKey}-slide-${index}`} className="splide__slide">
                <img 
                  src={slide.src} 
                  alt={slide.alt || `${projectKey} screenshot ${index + 1}`} 
                  className="project-image"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ProjectCarousel.propTypes = {
  projectKey: PropTypes.string.isRequired,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string
    })
  ).isRequired
};

export default ProjectCarousel; 