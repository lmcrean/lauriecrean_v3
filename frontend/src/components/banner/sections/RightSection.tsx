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
    <div className="w-1/3 bg-white p-6 flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-blue-600">Laurie Crean</h1>
      <div className="mt-2">
        <p className="text-2xl text-teal-500 font-semibold">Full-Stack</p>
        <p className="text-2xl text-orange-500 font-semibold">Software Engineer</p>
        <p className="text-2xl text-orange-500 font-semibold">Developer</p>
        <p className="text-2xl text-blue-500 font-semibold">QA Tester</p>
      </div>
      <p className="text-2xl text-gray-400 mt-4">lauriecrean.dev</p>
    </div>
  );
};

export default RightSection; 