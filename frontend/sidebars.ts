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
      value: '<a href="https://emerald-barbaraanne-47.tiiny.site" target="_blank" rel="noopener noreferrer" class="menu__link">Download CV <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" style="margin-left: 4px;"><path fill="currentColor" d="M19,19H5V5h7V3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-7h-2V19z M14,3v2h3.59l-9.83,9.83 l1.41,1.41L19,6.41V10h2V3H14z"></path></svg></a>', // External link with icon
    },
  ],
};

export default sidebars;
