"use client"

import React from 'react';
import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';

import Image from 'next/image';

// Define a TypeScript interface for icon props
interface IconProps {
  width?: number;
  height?: number;
  alt?: string;
}

// CodePen icon component
const CodePenIcon: React.FC<IconProps> = ({ width = 24, height = 24, alt = 'CodePen Icon' }) => (
    <Image src="/icons_social/codepen.svg" width={width} height={height} alt={alt} />
  );
  
  // GitHub icon component
  const GithubIcon: React.FC<IconProps> = ({ width = 24, height = 24, alt = 'GitHub Icon' }) => (
    <Image src="/icons_social/github.svg" width={width} height={height} alt={alt} />
  );
  
  // LinkedIn icon component
  const LinkedInIcon: React.FC<IconProps> = ({ width = 24, height = 24, alt = 'LinkedIn Icon' }) => (
    <Image src="/icons_social/linkedin.svg" width={width} height={height} alt={alt} />
  );
  
  // StackOverflow icon component
  const StackOverflowIcon: React.FC<IconProps> = ({ width = 24, height = 24, alt = 'StackOverflow Icon' }) => (
    <Image src="/icons_social/stackoverflow.svg" width={width} height={height} alt={alt} />
  );
  
  // Export the icons so they can be used elsewhere
  export { CodePenIcon, GithubIcon, LinkedInIcon, StackOverflowIcon };