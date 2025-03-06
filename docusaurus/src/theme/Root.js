import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SplideInit from '@site/src/components/SplideInit';

// Default implementation, that you can customize
export default function Root({children}) {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => <SplideInit />}
      </BrowserOnly>
    </>
  );
} 