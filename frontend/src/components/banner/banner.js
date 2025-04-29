import React from 'react';
import LeftSection from './sections/LeftSection';
import MiddleSection from './sections/MiddleSection';
import RightSection from './sections/RightSection';

const DeveloperBusinessCard = () => {
  return (
    <div className="flex w-full h-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <LeftSection />
      <MiddleSection />
      <RightSection />
    </div>
  );
};

export default DeveloperBusinessCard;