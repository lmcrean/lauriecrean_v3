"use client"

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import Image from 'next/image';

import { CodePenIcon, GithubIcon, LinkedInIcon, StackOverflowIcon } from './SocialComponents';

type IconName = 'codePen' | 'github' | 'linkedin' | 'stackOverflow'; // Define a type for the icon names

const SocialHeader = () => {
    // State to track if the CodePen icon is being hovered. At present this only works for the CodePen icon, but this could be expanded to work for all icons, so that the text for that isolated icon is displayed when that specific icon is hovered.
    // Initialize a state object to track hover state for each icon
    const [iconHoverStates, setIconHoverStates] = useState<{
        codePen: boolean;
        github: boolean;
        linkedin: boolean;
        stackOverflow: boolean;
    }>({
        codePen: false,
        github: false,
        linkedin: false,
        stackOverflow: false,
    });

    // Function to handle hover for a specific icon
    const handleIconHover = (iconName: IconName) => {
        setIconHoverStates((prevStates) => ({
          ...prevStates,
            [iconName]:!prevStates[iconName],
        }));
    };

    return (
        <header className='mt-4' style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem', width: '100%', maxWidth: '700px', margin: 'auto' }}>
            {/* CodePen icon and text */}
            <a href="https://www.codepen.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div
                    onMouseEnter={() => handleIconHover('codePen')}
                    onMouseLeave={() => handleIconHover('codePen')}
                    whileHover={{ scale: 1.5 }}
                    style={{ display: 'inline-block' }} // Ensure the div behaves like an inline element
                >
                    <CodePenIcon />
                </motion.div>
                <motion.p
                    className="icon-text"
                    initial={{ opacity: 0, y: 10 }} // Start slightly below final position
                    animate={{ opacity: iconHoverStates.codePen? 1 : 0, y: iconHoverStates.codePen? 0 : 10 }} // Animate based on hover state
                    transition={{ duration: 0.5 }} // Over 1 second
                    style={{ color: 'white' }} // Ensure text is white
                >
                    CodePen
                </motion.p>
            </a>

             {/* Github */}
             <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div
                    onMouseEnter={() => handleIconHover('github')}
                    onMouseLeave={() => handleIconHover('github')}
                    whileHover={{ scale: 1.5 }}
                    style={{ display: 'inline-block', filter: 'invert(1)' }} // Ensure the div behaves like an inline element
                >
                    <GithubIcon />
                </motion.div>
                <motion.p
                    className="icon-text"
                    initial={{ opacity: 0, y: 10 }} // Start slightly below final position
                    animate={{ opacity: iconHoverStates.github? 1 : 0, y: iconHoverStates.github? 0 : 10 }} // Animate based on hover state
                    transition={{ duration: 0.5 }} // Over 1 second
                    style={{ color: 'white' }} // Ensure text is white
                >
                    GitHub
                </motion.p>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div
                    onMouseEnter={() => handleIconHover('linkedin')}
                    onMouseLeave={() => handleIconHover('linkedin')}
                    whileHover={{ scale: 1.5 }}
                    style={{ display: 'inline-block' }} // Ensure the div behaves like an inline element
                >
                    <LinkedInIcon />
                </motion.div>
                <motion.p
                    className="icon-text"
                    initial={{ opacity: 0, y: 10 }} // Start slightly below final position
                    animate={{ opacity: iconHoverStates.linkedin? 1 : 0, y: iconHoverStates.linkedin? 0 : 10 }} // Animate based on hover state
                    transition={{ duration: 0.5 }} // Over 1 second
                    style={{ color: 'white' }} // Ensure text is white
                >
                    LinkedIn
                </motion.p>
            </a>

            {/* StackOverflow */}
            <a href="https://www.stackoverflow.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.div
                    onMouseEnter={() => handleIconHover('stackOverflow')}
                    onMouseLeave={() => handleIconHover('stackOverflow')}
                    whileHover={{ scale: 1.5 }}
                    style={{ display: 'inline-block' }} // Ensure the div behaves like an inline element
                >
                    <StackOverflowIcon />
                </motion.div>
                <motion.p
                    className="icon-text"
                    initial={{ opacity: 0, y:10 }} // Start slightly below final position
                    animate={{ opacity: iconHoverStates.stackOverflow? 1 : 0, y: iconHoverStates.stackOverflow? 0 : 10 }} // Animate based on hover state
                    transition={{ duration: 0.5 }} // Over 1 second
                    style={{ color: 'white' }} // Ensure text is white
                >
                    StackOverflow
                </motion.p>
            </a>
        </header>
    );
};

export default SocialHeader;