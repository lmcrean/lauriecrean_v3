import React from 'react';

const MiddleSection = () => {
  return (
    <div className="w-1/3 bg-blue-500 p-4 relative">
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
        {/* Vertical dotted line with 12 squares */}
        <div className="absolute left-8 top-0 bottom-0 h-full flex flex-col justify-between py-4">
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
        </div>

        {/* Code snippets */}
        <div className="w-full flex flex-col space-y-3">
          <div className="h-2 w-24 bg-yellow-300 rounded ml-12"></div>
          <div className="h-2 w-36 bg-yellow-300 rounded ml-12"></div>
          <div className="h-2 w-16 bg-yellow-300 rounded ml-12"></div>
          <div className="h-2 w-24 bg-teal-400 rounded ml-12"></div>
          <div className="h-2 w-32 bg-teal-400 rounded ml-12"></div>
          <div className="h-2 w-20 bg-blue-300 rounded ml-12"></div>
          <div className="h-2 w-28 bg-orange-400 rounded ml-12"></div>
          <div className="h-2 w-24 bg-blue-300 rounded ml-12"></div>
          <div className="h-2 w-32 bg-teal-400 rounded ml-12"></div>
          <div className="h-2 w-16 bg-yellow-300 rounded ml-12"></div>
          <div className="h-2 w-32 bg-teal-400 rounded ml-12"></div>
        </div>
      </div>
    </div>
  );
};

export default MiddleSection; 