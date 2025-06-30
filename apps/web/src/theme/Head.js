import React from 'react';
import Head from '@docusaurus/Head';
import {useThemeConfig} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// This component will extend the default Head component of Docusaurus
export default function HeadCustom(props) {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const {title, description, image} = props;
  const {
    metadata: {charSet, viewport},
    metadatas,
    favicon,
  } = useThemeConfig();

  return (
    <>
      <Head {...props}>
        {/* Explicitly add the favicon from GitHub */}
        <link 
          rel="icon" 
          href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" 
          type="image/x-icon" 
        />
        <link 
          rel="shortcut icon" 
          href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" 
          type="image/x-icon" 
        />
      </Head>
    </>
  );
} 