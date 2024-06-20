"use client"

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import Image from 'next/image';

import { CodePenIcon, GithubIcon, LinkedInIcon, StackOverflowIcon } from './SocialComponents';

const SocialHeader = () => {
    // State to track if the CodePen icon is being hovered
    const [isIconHovered, setIsIconHovered] = useState(false);

    return (
        <header style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem' }}>
            <a href="https://www.codepen.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}
                    whileHover={{ scale: 1.5 }}
                    style={{ display: 'inline-block' }} // Ensure the div behaves like an inline element
                >
                    <CodePenIcon />
                </motion.div>
                <motion.p
                    className="icon-text"
                    initial={{ opacity: 0, y: 10 }} // Start slightly below final position
                    animate={isIconHovered? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} // Animate based on icon hover state
                    transition={{ duration: 0.5 }} // Over 1 second
                    style={{ color: 'white' }} // Ensure text is white
                >
                    CodePen
                </motion.p>
            </a>
        </header>
    );
};

export default SocialHeader;