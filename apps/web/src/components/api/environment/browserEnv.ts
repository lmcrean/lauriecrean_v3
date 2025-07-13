/**
 * Browser-compatible environment variable access utilities
 * Handles different ways to access environment variables in browser environments
 */

/**
 * Browser-compatible environment variable access
 * Tries multiple methods to find environment variables in browser context
 */
export const getBrowserEnv = (key: string, defaultValue?: string): string | undefined => {
  // Debug logging
  console.log(`🔍 getBrowserEnv called with key: ${key}, defaultValue: ${defaultValue}`);
  
  // Try different ways to access environment variables in browser
  
  // 1. Try window.__ENV__ (if available)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    const value = (window as any).__ENV__[key];
    if (value && value !== 'undefined') {
      console.log(`🌐 Found ${key} in window.__ENV__: ${value}`);
      return value;
    }
  }
  
  // 2. Try Docusaurus customFields (most reliable for build-time env vars)
  if (typeof window !== 'undefined') {
    // Try multiple ways to access Docusaurus config
    const docusaurusConfig = (window as any).docusaurus || (window as any).__DOCUSAURUS_CONFIG__;
    console.log(`🔍 Docusaurus object structure:`, docusaurusConfig);
    
    // Enhanced debugging for Docusaurus structure
    if (docusaurusConfig) {
      console.log(`🔍 Docusaurus keys:`, Object.keys(docusaurusConfig));
      
      // Try accessing via different paths
      const paths = [
        'siteConfig.customFields',
        'customFields',
        'config.customFields',
        'siteConfig.config.customFields'
      ];
      
      for (const path of paths) {
        const pathValue = path.split('.').reduce((obj, key) => obj?.[key], docusaurusConfig);
        if (pathValue) {
          console.log(`🔍 Found customFields at path: ${path}`, pathValue);
          const value = pathValue[key];
          if (value && value !== 'undefined' && value !== '') {
            console.log(`🌐 Found ${key} in Docusaurus customFields: ${value}`);
            return value;
          }
        }
      }
    }
    
    if (docusaurusConfig && docusaurusConfig.siteConfig && docusaurusConfig.siteConfig.customFields) {
      console.log(`🔍 CustomFields available:`, docusaurusConfig.siteConfig.customFields);
      const value = docusaurusConfig.siteConfig.customFields[key];
      if (value && value !== 'undefined' && value !== '') {
        console.log(`🌐 Found ${key} in Docusaurus customFields: ${value}`);
        return value;
      }
    } else {
      console.log(`🔍 Docusaurus siteConfig or customFields not found`);
      console.log(`   - docusaurusConfig:`, !!docusaurusConfig);
      console.log(`   - siteConfig:`, !!docusaurusConfig?.siteConfig);
      console.log(`   - customFields:`, !!docusaurusConfig?.siteConfig?.customFields);
    }
  }
  
  // 3. Try webpack DefinePlugin injected variables (common in React builds)
  if (typeof window !== 'undefined') {
    // Check for webpack DefinePlugin variables injected into window
    const webpackVar = (window as any)[`window.${key}`] || (window as any)[key];
    if (webpackVar && webpackVar !== 'undefined') {
      console.log(`🌐 Found ${key} in webpack globals: ${webpackVar}`);
      return webpackVar;
    }
  }
  
  // 4. Try process.env (webpack DefinePlugin)
  if (typeof process !== 'undefined' && process.env) {
    const processEnvVar = process.env[key];
    if (processEnvVar && processEnvVar !== 'undefined') {
      console.log(`🌐 Found ${key} in process.env: ${processEnvVar}`);
      return processEnvVar;
    }
  }

  // 5. Try import.meta.env (Vite/modern bundlers)
  if (typeof globalThis !== 'undefined' && 'importMeta' in globalThis) {
    const importMeta = (globalThis as any).importMeta;
    if (importMeta && importMeta.env) {
      const value = importMeta.env[key];
      if (value && value !== 'undefined') {
        console.log(`🌐 Found ${key} in import.meta.env: ${value}`);
        return value;
      }
    }
  }
  
  // 6. Fallback to default
  console.log(`⚠️ Environment variable ${key} not found in any location, using default: ${defaultValue}`);
  return defaultValue;
}; 