import React from 'react';
import ProjectCarousel from '../ProjectCarousel';
import SplideInit from '../SplideInit';

/**
 * Example component showing how to use the ProjectCarousel component
 */
export default function CarouselExample() {
  return (
    <div className="carousel-examples">
      <h2>Project Carousels</h2>
      
      <h3>Odyssey Project</h3>
      <ProjectCarousel projectKey="odyssey" />
      
      <h3>Coach Matrix Project</h3>
      <ProjectCarousel projectKey="coachmatrix" />
      
      <h3>Buffalo Project</h3>
      <ProjectCarousel projectKey="buffalo" />
      
      {/* The SplideInit component needs to be included once in your app */}
      <SplideInit />
    </div>
  );
} 