import React from 'react';

/**
 * Right Section Component
 * 
 * Displays the developer's information including:
 * - Name
 * - Job titles/roles
 * - Website URL
 */
const RightSection: React.FC = () => {
  return (
    <div className="w-full md:w-3/6 lg:w-1/2 md:flex-shrink-0 md:min-w-120 bg-blue-400 p-6 flex flex-col justify-center">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">Laurie Crean</div>
      <div className="mt-1">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-yellow-300 font-semibold">Back End Software Developer</div>
      </div>
    </div>
  );
};

export default RightSection;