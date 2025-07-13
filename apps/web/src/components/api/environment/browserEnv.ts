/**
 * Browser-compatible environment variable access utilities
 * Handles different ways to access environment variables in browser environments
 */

/**
 * Browser-compatible environment variable access
 * Tries multiple methods to find environment variables in browser context
 */
export const getBrowserEnv = (key: string, defaultValue?: string): string | undefined => {
  // Try different ways to access environment variables in browser
  
  // 1. Try window object (if available)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue;
  }
  
  // 2. Try Docusaurus customFields (most reliable for build-time env vars)
  if (typeof window !== 'undefined' && (window as any).docusaurus) {
    const docusaurusConfig = (window as any).docusaurus;
    console.log(`🔍 Docusaurus object structure:`, docusaurusConfig);
    
    if (docusaurusConfig && docusaurusConfig.siteConfig && docusaurusConfig.siteConfig.customFields) {
      console.log(`🔍 CustomFields available:`, docusaurusConfig.siteConfig.customFields);
      const value = docusaurusConfig.siteConfig.customFields[key];
      if (value && value !== 'undefined') {
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
  
  // 3. Try import.meta.env (Vite/modern bundlers)
  if (typeof globalThis !== 'undefined' && 'importMeta' in globalThis) {
    const importMeta = (globalThis as any).importMeta;
    if (importMeta && importMeta.env) {
      return importMeta.env[key] || defaultValue;
    }
  }
  
  // 4. Try process.env only if in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // 5. Fallback to default
  return defaultValue;
}; 