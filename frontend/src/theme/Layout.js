import React, { useState, useEffect } from 'react';
import Layout from '@theme-original/Layout';
import Head from '@docusaurus/Head';
import DeveloperBusinessCard from '../components/banner/banner';

export default function LayoutWrapper(props) {
  const [showBanner, setShowBanner] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show banner when at top or scrolling up
      if (currentScrollY === 0) {
        setShowBanner(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowBanner(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past banner height
        setShowBanner(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      
      {/* Global Banner */}
      <div 
        className={`global-banner ${showBanner ? 'show' : 'hide'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: showBanner ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div className="max-w-6xl mx-auto p-4">
          <DeveloperBusinessCard />
        </div>
      </div>

      {/* Add padding to account for banner height when visible */}
      <div style={{ paddingTop: showBanner ? '280px' : '0px', transition: 'padding-top 0.3s ease-in-out' }}>
        <Layout {...props} />
      </div>
    </>
  );
} 