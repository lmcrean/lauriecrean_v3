// TestMotionComponent.tsx
import React from 'react';
import { motion } from 'framer-motion'; // bug: error when applying motion.div to a component
// Error: (0 , react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function


const TestMotionComponent = () => {
  return (
    <section>
        <div>
            <h1>Test Motion Component</h1>
        </div>
    </section>
  );
};

export default TestMotionComponent;

