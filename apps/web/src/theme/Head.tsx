import React from 'react';
import Head from '@docusaurus/Head';

interface HeadCustomProps {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

// This component will extend the default Head component of Docusaurus
const HeadCustom: React.FC<HeadCustomProps> = (props) => {
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
};

export default HeadCustom; 