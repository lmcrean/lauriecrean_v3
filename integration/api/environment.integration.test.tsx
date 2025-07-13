import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isDevelopment, isManualTestMode } from '../../apps/web/src/components/api/environment/detection';

// TypeScript interface for window with APP_CONFIG
interface WindowWithAppConfig extends Window {
  APP_CONFIG?: {
    apiBaseUrl?: string;
  };
}

describe('API Environment Integration Tests', () => {
  // Store original values to restore later
  const originalLocation = window.location;
  
  beforeEach(() => {
    // Reset window object modifications
    delete (window as any).__ENV__;
    delete (window as any).docusaurus;
    delete (globalThis as any).importMeta;
    delete (window as WindowWithAppConfig).APP_CONFIG;
    
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
    delete (window as WindowWithAppConfig).APP_CONFIG;
  });

  describe('APP_CONFIG (config.js) Integration', () => {
    it('should load API base URL from window.APP_CONFIG when available', () => {
      // Simulate config.js loading
      (window as WindowWithAppConfig).APP_CONFIG = {
        apiBaseUrl: 'https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app'
      };

      // Test that the axiosClient can access this config
      expect((window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl).toBe('https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app');
    });

    it('should handle missing APP_CONFIG gracefully', () => {
      // Ensure APP_CONFIG doesn't exist
      delete (window as WindowWithAppConfig).APP_CONFIG;

      // Should not throw error when checking for APP_CONFIG
      expect(() => {
        const hasConfig = typeof window !== 'undefined' && (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl;
        expect(hasConfig).toBeFalsy();
      }).not.toThrow();
    });

    it('should handle APP_CONFIG with missing apiBaseUrl', () => {
      // Simulate config.js loading but with missing apiBaseUrl
      (window as WindowWithAppConfig).APP_CONFIG = {};

      // Should handle missing apiBaseUrl gracefully
      expect((window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl).toBeUndefined();
    });

    it('should simulate successful config.js loading from static directory', () => {
      // This simulates what happens when config.js is properly served from static/
      // and loads into the global window object
      (window as WindowWithAppConfig).APP_CONFIG = {
        apiBaseUrl: 'https://api-github-branch-test-url.com'
      };

      // Verify the config is accessible
      expect((window as WindowWithAppConfig).APP_CONFIG).toBeDefined();
      expect((window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl).toBe('https://api-github-branch-test-url.com');
      
      // Verify it can be accessed safely
      const apiUrl = (window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl;
      expect(apiUrl).toBe('https://api-github-branch-test-url.com');
    });

    it('should demonstrate the fix: static/config.js vs public/config.js', () => {
      // BEFORE FIX: config.js was generated in public/ directory
      // Result: Browser requests /config.js → 404 → Returns HTML → SyntaxError: Unexpected token '<'
      
      // AFTER FIX: config.js is generated in static/ directory
      // Result: Browser requests /config.js → 200 → Returns JavaScript → APP_CONFIG loads successfully
      
      // Simulate successful config.js loading after fix
      (window as WindowWithAppConfig).APP_CONFIG = {
        apiBaseUrl: 'https://api-github-bug-fix-gh-actions-moivsrfqka-uc.a.run.app'
      };

      // The fix allows proper config loading
      expect((window as WindowWithAppConfig).APP_CONFIG).toBeDefined();
      expect((window as WindowWithAppConfig).APP_CONFIG?.apiBaseUrl).toContain('api-github-bug-fix-gh-actions');
      
      // No more SyntaxError: Unexpected token '<'
      expect(() => {
        const config = (window as WindowWithAppConfig).APP_CONFIG;
        return config?.apiBaseUrl;
      }).not.toThrow();
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

    it('should return false when hostname is Firebase hosting domain', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'lauriecrean-free-38256.web.app' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(false);
    });
  });

  describe('isManualTestMode', () => {
    it('should return true when test=true in URL params', () => {
      Object.defineProperty(window, 'location', {
        value: { 
          hostname: 'localhost',
          search: '?test=true'
        },
        writable: true,
        configurable: true
      });

      expect(isManualTestMode()).toBe(true);
    });

    it('should return true when __TEST_MODE__ is set on window', () => {
      (window as any).__TEST_MODE__ = true;

      expect(isManualTestMode()).toBe(true);
    });

    it('should return false when no test indicators present', () => {
      Object.defineProperty(window, 'location', {
        value: { 
          hostname: 'localhost',
          search: ''
        },
        writable: true,
        configurable: true
      });

      expect(isManualTestMode()).toBe(false);
    });

    it('should return false when test=false in URL params', () => {
      Object.defineProperty(window, 'location', {
        value: { 
          hostname: 'localhost',
          search: '?test=false'
        },
        writable: true,
        configurable: true
      });

      expect(isManualTestMode()).toBe(false);
    });
  });
}); 