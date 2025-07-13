import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBrowserEnv } from '../../apps/web/src/components/api/environment/browserEnv';
import { isDevelopment, isManualTestMode } from '../../apps/web/src/components/api/environment/detection';

describe('API Environment Integration Tests', () => {
  // Store original values to restore later
  const originalLocation = window.location;
  const originalWindow = { ...window };
  
  beforeEach(() => {
    // Reset window object modifications
    delete (window as any).__ENV__;
    delete (window as any).docusaurus;
    delete (globalThis as any).importMeta;
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
    
    // Clean up window modifications
    delete (window as any).__ENV__;
    delete (window as any).docusaurus;
    delete (globalThis as any).importMeta;
  });

  describe('getBrowserEnv', () => {
    it('should return value from window.__ENV__ when available', () => {
      (window as any).__ENV__ = {
        REACT_APP_API_BASE_URL: 'http://test-env.com'
      };

      const result = getBrowserEnv('REACT_APP_API_BASE_URL');
      expect(result).toBe('http://test-env.com');
    });

    it('should return value from Docusaurus customFields when available', () => {
      (window as any).docusaurus = {
        siteConfig: {
          customFields: {
            DOCUSAURUS_API_BASE_URL: 'http://docusaurus-api.com'
          }
        }
      };

      const result = getBrowserEnv('DOCUSAURUS_API_BASE_URL');
      expect(result).toBe('http://docusaurus-api.com');
    });

    it('should return value from import.meta.env when available', () => {
      (globalThis as any).importMeta = {
        env: {
          VITE_API_URL: 'http://vite-api.com'
        }
      };

      const result = getBrowserEnv('VITE_API_URL');
      expect(result).toBe('http://vite-api.com');
    });

    it('should return default value when environment variable not found', () => {
      const result = getBrowserEnv('NON_EXISTENT_VAR', 'default-value');
      expect(result).toBe('default-value');
    });

    it('should return undefined when no default provided and variable not found', () => {
      const result = getBrowserEnv('NON_EXISTENT_VAR');
      expect(result).toBeUndefined();
    });

    it('should prioritize window.__ENV__ over Docusaurus customFields', () => {
      (window as any).__ENV__ = {
        TEST_VAR: 'window-env-value'
      };
      
      (window as any).docusaurus = {
        siteConfig: {
          customFields: {
            TEST_VAR: 'docusaurus-value'
          }
        }
      };

      const result = getBrowserEnv('TEST_VAR');
      expect(result).toBe('window-env-value');
    });

    it('should skip undefined values from Docusaurus customFields', () => {
      (window as any).docusaurus = {
        siteConfig: {
          customFields: {
            UNDEFINED_VAR: 'undefined'
          }
        }
      };

      const result = getBrowserEnv('UNDEFINED_VAR', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('isDevelopment', () => {
    it('should return true when hostname is localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(true);
    });

    it('should return true when hostname is 127.0.0.1', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '127.0.0.1' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(true);
    });

    it('should return true when hostname is ::1', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '::1' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(true);
    });

    it('should return false when hostname is production domain', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp.com' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(false);
    });

    it('should return true when NODE_ENV is development', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'production.com' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        NODE_ENV: 'development'
      };

      expect(isDevelopment()).toBe(true);
    });

    it('should return true when NODE_ENV is dev', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'production.com' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        NODE_ENV: 'dev'
      };

      expect(isDevelopment()).toBe(true);
    });

    it('should prioritize hostname over NODE_ENV', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        NODE_ENV: 'production'
      };

      expect(isDevelopment()).toBe(true);
    });
  });

  describe('isManualTestMode', () => {
    it('should return true when REACT_APP_TEST_MODE is true', () => {
      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'true'
      };

      expect(isManualTestMode()).toBe(true);
    });

    it('should return false when REACT_APP_TEST_MODE is false', () => {
      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'false'
      };

      expect(isManualTestMode()).toBe(false);
    });

    it('should return false when REACT_APP_TEST_MODE is not set', () => {
      expect(isManualTestMode()).toBe(false);
    });

    it('should return false when REACT_APP_TEST_MODE is undefined', () => {
      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: undefined
      };

      expect(isManualTestMode()).toBe(false);
    });
  });

  describe('Environment Integration Scenarios', () => {
    it('should handle Firebase deployment environment', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-123-abc123.web.app' },
        writable: true,
        configurable: true
      });

      (window as any).docusaurus = {
        siteConfig: {
          customFields: {
            DOCUSAURUS_API_BASE_URL: 'https://api-github-bug-fix-gh-actions.us-central1.run.app'
          }
        }
      };

      expect(isDevelopment()).toBe(false);
      expect(getBrowserEnv('DOCUSAURUS_API_BASE_URL')).toBe('https://api-github-bug-fix-gh-actions.us-central1.run.app');
    });

    it('should handle local development with manual test mode', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'true'
      };

      expect(isDevelopment()).toBe(true);
      expect(isManualTestMode()).toBe(true);
    });

    it('should handle production environment', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'laurie-crean.dev' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        NODE_ENV: 'production'
      };

      expect(isDevelopment()).toBe(false);
      expect(isManualTestMode()).toBe(false);
    });
  });
}); 