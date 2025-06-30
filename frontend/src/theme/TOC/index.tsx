import React from 'react';
import { useLocation } from '@docusaurus/router';
import CustomTOC from '@site/src/components/CustomTOC';

/**
 * Custom TOC Theme Component
 * 
 * This overrides Docusaurus's default TOC behavior for the main projects page
 */
export default function TOC(): JSX.Element {
  const location = useLocation();
  
  // Use custom TOC only for the main projects page
  if (location.pathname === '/' || location.pathname === '/projects') {
    return <CustomTOC />;
  }
  
  // For other pages, return null to hide TOC (since we set hide_table_of_contents: true)
  return null;
} 