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
    const docusaurusGlobal = (window as any);
    
    // Try different global objects where Docusaurus might store config
    const possibleConfigSources = [
      'docusaurus',
      '__DOCUSAURUS_CONFIG__',
      'siteConfig',
      '__DOCUSAURUS_SITE_CONFIG__',
      'docusaurusConfig'
    ];
    
    console.log(`🔍 Testing Docusaurus config sources...`);
    
    for (const sourceName of possibleConfigSources) {
      const configSource = docusaurusGlobal[sourceName];
      if (configSource) {
        console.log(`🔍 Found ${sourceName}:`, configSource);
        console.log(`🔍 ${sourceName} keys:`, Object.keys(configSource));
        
        // Try to access customFields from different paths
        const possiblePaths = [
          `${sourceName}.customFields`,
          `${sourceName}.siteConfig.customFields`,
          `${sourceName}.config.customFields`,
          `${sourceName}.siteConfig.config.customFields`
        ];
        
        for (const path of possiblePaths) {
          const pathValue = path.split('.').reduce((obj, key) => obj?.[key], { [sourceName]: configSource });
          if (pathValue && pathValue[key]) {
            console.log(`🔍 Found customFields at path: ${path}`, pathValue);
            const value = pathValue[key];
            if (value && value !== 'undefined' && value !== '') {
              console.log(`🌐 Found ${key} in Docusaurus customFields: ${value}`);
              return value;
            }
          }
        }
      }
    }
    
    console.log(`🔍 Docusaurus siteConfig or customFields not found`);
    console.log(`   - Available global keys:`, Object.keys(docusaurusGlobal).filter(k => k.includes('docusaurus') || k.includes('config')));
  }
  
  // 3. Try webpack DefinePlugin injected variables (common in React builds)
  if (typeof window !== 'undefined') {
    // Check for webpack DefinePlugin variables injected into window
    const webpackWindowVar = (window as any)[`window.${key}`];
    if (webpackWindowVar && webpackWindowVar !== 'undefined') {
      console.log(`🌐 Found ${key} in webpack window globals: ${webpackWindowVar}`);
      return webpackWindowVar;
    }
    
    // Check for direct window property access
    const directWindowVar = (window as any)[key];
    if (directWindowVar && directWindowVar !== 'undefined') {
      console.log(`🌐 Found ${key} in direct window access: ${directWindowVar}`);
      return directWindowVar;
    }
    
    // Check for window.env object
    if ((window as any).env && (window as any).env[key]) {
      const envVar = (window as any).env[key];
      if (envVar && envVar !== 'undefined') {
        console.log(`🌐 Found ${key} in window.env: ${envVar}`);
        return envVar;
      }
    }
    
    console.log(`🔍 Webpack DefinePlugin variables not found for ${key}`);
    console.log(`   - window.${key}:`, (window as any)[`window.${key}`]);
    console.log(`   - window[${key}]:`, (window as any)[key]);
    console.log(`   - window.env[${key}]:`, (window as any).env?.[key]);
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