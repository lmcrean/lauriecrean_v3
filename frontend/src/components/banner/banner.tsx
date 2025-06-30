import React from 'react';
import LeftSection from './sections/LeftSection';
import MiddleSection from './sections/MiddleSection';
import RightSection from './sections/RightSection';

/**
 * Developer Business Card Banner Component
 * 
 * A three-section banner component displaying a developer's information:
 * - Left: Code visualization with colored bars
 * - Middle: Vertical dots and code snippets  
 * - Right: Developer name, titles, and website
 */
const DeveloperBusinessCard: React.FC = () => {
  return (
    <div className="flex w-full h-48 md:h-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <LeftSection />
      <MiddleSection />
      <RightSection />
    </div>
  );
};

export default DeveloperBusinessCard; 