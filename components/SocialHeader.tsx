"use client"

import React from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import Image from 'next/image';

import { CodePenIcon, GithubIcon, LinkedInIcon, StackOverflowIcon } from './SocialComponents';

const SocialHeader = () => {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem' }}>
            <motion.div whileHover={{ scale: 1.1 }}>
                <a href="https://www.codepen.io/" target="_blank" rel="noopener noreferrer">
                    <CodePenIcon />
                    <p>Github</p> {/* Placeholder text, replace with actual text */}
                </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                    <GithubIcon />
                    <p>Github</p>
                </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                    <p>LinkedIn</p>
                </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
                <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer">
                    <StackOverflowIcon />
                    <p>StackOverflow</p>
                </a>
            </motion.div>
        </header>
    );
};
export default SocialHeader;