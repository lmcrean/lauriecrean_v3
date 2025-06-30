import React from 'react';
import CustomTOC from '@site/src/components/CustomTOC';

/**
 * Custom TOC Theme Component
 * 
 * This overrides Docusaurus's default TOC behavior
 */
export default function TOC(): JSX.Element {
  // Always use our custom TOC
  return <CustomTOC />;
} 