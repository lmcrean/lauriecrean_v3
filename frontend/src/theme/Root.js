import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SplideInit from '@site/src/components/SplideInit';
import Fonts from '@site/src/components/Fonts';

// Default implementation, that you can customize
export default function Root({children}) {
  return (
    <>
      <Fonts />
      {children}
      <BrowserOnly>
        {() => <SplideInit />}
      </BrowserOnly>
    </>
  );
} 