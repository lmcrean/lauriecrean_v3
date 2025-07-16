import React from 'react';
import Layout from '@theme-original/Layout';
import Head from '@docusaurus/Head';

interface LayoutWrapperProps {
  [key: string]: any;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = (props) => {
  return (
    <>
      <Head>
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
      <Layout {...props} />
    </>
  );
};

export default LayoutWrapper; 