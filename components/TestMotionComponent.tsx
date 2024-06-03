"use client"

// TestMotionComponent.tsx
import React from 'react';
import { motion } from 'framer-motion'; 


const TestMotionComponent = () => {
  return (
    <section className='d-flex'>
       <motion.h1 className='text-white text-xl font-bold mb-3 mt-5 mx-auto'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 5 }}
        >
          Test Motion Component
        </motion.h1>
    </section>
  );
};

export default TestMotionComponent;

