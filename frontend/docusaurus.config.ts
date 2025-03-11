import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Laurie Crean',
  tagline: 'Full-Stack Software Engineer, Developer, QA Tester',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://lauriecrean-v3-fl6r6kiez-lmcreans-projects.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lmcrean', // Usually your GitHub org/user name.
  projectName: 'lauriecrean', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Add splide scripts directly to the head
  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js',
      async: true,
    },
    {
      src: '/js/init-splide.js',
      async: true,
      defer: true,
    },
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css',
      type: 'text/css',
    },
    // Add Font Awesome
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
      type: 'text/css',
      integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Set routeBasePath to '/' to make docs the landing page
          routeBasePath: '/',
          // Remove the edit URL
          editUrl: undefined,
          // Configure TOC (Table of Contents) for sidebar
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        theme: {
          customCss: ['./src/css/custom.css', './src/css/splide-custom.css', './src/css/buttons.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.svg',
    // Add colorMode configuration
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'Laurie Crean',
      logo: {
        alt: 'Laurie Crean Portfolio Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/lauriecrean',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.linkedin.com/in/lcrean/',
          label: 'LinkedIn',
          position: 'right',
        },
        {
          href: 'mailto:lmcrean@gmail.com',
          label: 'Email',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Contact',
          items: [
            {
              label: 'Email',
              href: 'mailto:lmcrean@gmail.com',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lmcrean',
            },
            {
              label: 'LinkedIn',
              href: 'http://linkedin.com/in/lcrean',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'LeetCode',
              href: 'https://leetcode.com/lmcrean',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/users/21992930/laurie-crean?tab=topactivity',
            },
            {
              label: 'HackerRank',
              href: 'https://www.hackerrank.com/profile/mrcrean92',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Laurie Crean. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // Add this section for client modules
  clientModules: [
    // Add scripts that need to run on every page here
    require.resolve('./src/css/splide-custom.css'),
    require.resolve('./src/css/buttons.css'),
  ],
};

export default config;
