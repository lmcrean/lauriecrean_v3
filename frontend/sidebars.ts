import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main sidebar with all documents
  docs: [
    {
      type: 'doc',
      id: 'index',
      label: 'Projects',
    },
    {
      type: 'doc',
      id: 'certifications',
      label: 'Certifications',
    },
    {
      type: 'doc',
      id: 'experience',
      label: 'Experience',
    },
    {
      type: 'doc',
      id: 'education',
      label: 'Education',
    },
    {
      type: 'doc',
      id: 'agile',
      label: 'Agile Development',
    },
  ],
};

export default sidebars;
