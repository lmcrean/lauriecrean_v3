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
      type: 'html',
      value: '<a href="https://emerald-barbaraanne-47.tiiny.site" target="_blank" rel="noopener noreferrer" class="menu__link">Download CV</a>', // External link opening in new tab
      defaultStyle: true, // Use the default menu link styling
    },
  ],
};

export default sidebars;
