import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SplideInit from '@site/src/components/SplideInit';

interface RootProps {
  children: React.ReactNode;
}

// Default implementation, that you can customize
const Root: React.FC<RootProps> = ({children}) => {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => <SplideInit />}
      </BrowserOnly>
    </>
  );
};

export default Root; 