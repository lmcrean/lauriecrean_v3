import React from 'react';

/**
 * Left Section Component
 * 
 * Displays a code visualization with colored bars representing
 * lines of code in different syntax highlighting colors
 */
const LeftSection: React.FC = () => {
  return (
    <div className="w-1/6 bg-blue-500 p-4 relative hidden md:block">
      <div className="absolute inset-0 p-6">
        {/* Code line representations */}
        <div className="flex flex-col h-full space-y-3">
          <div className="flex space-x-2">
            <div className="h-3 w-12 bg-blue-300 rounded"></div>
            <div className="h-3 w-20 bg-blue-300 rounded"></div>
            <div className="h-3 w-8 bg-orange-400 rounded"></div>
            <div className="h-3 w-6 bg-blue-800 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-8 bg-orange-400 rounded"></div>
            <div className="h-3 w-16 bg-blue-300 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-24 bg-blue-300 rounded"></div>
            <div className="h-3 w-10 bg-orange-400 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-6 bg-red-400 rounded"></div>
            <div className="h-3 w-28 bg-blue-300 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-8 bg-red-400 rounded"></div>
            <div className="h-3 w-10 bg-orange-400 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-6 bg-purple-600 rounded"></div>
            <div className="h-3 w-8 bg-blue-300 rounded"></div>
          </div>
          <div className="h-10"></div>
          <div className="flex space-x-2">
            <div className="h-3 w-6 bg-red-400 rounded"></div>
            <div className="h-3 w-8 bg-orange-400 rounded"></div>
            <div className="h-3 w-16 bg-blue-300 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-3 w-8 bg-purple-600 rounded"></div>
            <div className="h-3 w-12 bg-orange-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection; 