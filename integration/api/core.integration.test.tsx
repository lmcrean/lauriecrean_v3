import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import the Core module and its exports
import apiClient, { 
  getBrowserEnv, 
  isDevelopment, 
  isManualTestMode,
  findApiPort,
  getApiPort,
  getApiBaseUrl,
  cleanBranchName,
  extractPotentialBranchNames,
  getSystematicBranchPatterns,
  testApiUrl,
  generateApiUrlPatterns,
  API_BASE_URL
} from '../../apps/web/src/components/api/Core';

describe('API Core Integration Tests', () => {
  let originalWindow: typeof window;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Store originals
    originalWindow = window;
    originalFetch = global.fetch;
    
    // Mock console to reduce noise
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(window, 'location', {
      value: originalWindow.location,
      writable: true,
      configurable: true
    });
    global.fetch = originalFetch;
    
    // Clean up window modifications
    delete (window as any).__ENV__;
    delete (window as any).docusaurus;
    delete (window as any).__TEST_API_URL__;
    
    vi.restoreAllMocks();
  });

  describe('Module Exports', () => {
    it('should export all environment utilities', () => {
      expect(typeof getBrowserEnv).toBe('function');
      expect(typeof isDevelopment).toBe('function');
      expect(typeof isManualTestMode).toBe('function');
    });

    it('should export all discovery utilities', () => {
      expect(typeof findApiPort).toBe('function');
      expect(typeof getApiPort).toBe('function');
      expect(typeof getApiBaseUrl).toBe('function');
      expect(typeof cleanBranchName).toBe('function');
      expect(typeof extractPotentialBranchNames).toBe('function');
      expect(typeof getSystematicBranchPatterns).toBe('function');
      expect(typeof testApiUrl).toBe('function');
      expect(typeof generateApiUrlPatterns).toBe('function');
    });

    it('should export the API client', () => {
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
      expect(typeof apiClient.put).toBe('function');
      expect(typeof apiClient.delete).toBe('function');
    });

    it('should export API_BASE_URL constant', () => {
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL).toBeTruthy();
    });

    it('should provide default export as API client', () => {
      // Test that default export is the same as named export
      expect(apiClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
    });
  });

  describe('Environment Detection Integration', () => {
    it('should detect localhost development environment', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(true);
      expect(isManualTestMode()).toBe(false);
    });

    it('should detect manual test mode', () => {
      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'true'
      };

      expect(isManualTestMode()).toBe(true);
    });

    it('should detect production environment', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp.com' },
        writable: true,
        configurable: true
      });

      expect(isDevelopment()).toBe(false);
      expect(isManualTestMode()).toBe(false);
    });

    it('should get environment variables from multiple sources', () => {
      (window as any).__ENV__ = {
        REACT_APP_API_BASE_URL: 'https://window-env-api.com'
      };

      expect(getBrowserEnv('REACT_APP_API_BASE_URL')).toBe('https://window-env-api.com');
      expect(getBrowserEnv('NON_EXISTENT_VAR', 'default')).toBe('default');
    });
  });

  describe('Branch Detection Integration', () => {
    it('should clean branch names consistently', () => {
      expect(cleanBranchName('feature/add-new-component')).toBe('feature-add-new-component');
      expect(cleanBranchName('bug-fix/cors-issues')).toBe('bug-fix-cors-issues');
      expect(cleanBranchName('Feature/Add-New-Component')).toBe('feature-add-new-component');
    });

    it('should extract potential branch names from PR context', () => {
      const branches = extractPotentialBranchNames('123', 'abc123');
      
      expect(branches).toContain('abc123');
      expect(branches).toContain('bug-fix-gh-actions');
      expect(branches).toContain('pr-123');
      expect(branches).toContain('branch-123');
    });

    it('should generate systematic branch patterns', () => {
      const patterns = getSystematicBranchPatterns('42');
      
      expect(patterns).toContain('bug-fix-gh-actions');
      expect(patterns).toContain('feature-branch-42');
      expect(patterns).toContain('hotfix-42');
    });

    it('should generate API URL patterns', () => {
      const patterns = generateApiUrlPatterns('my-branch');
      
      expect(patterns).toEqual([
        'https://api-github-my-branch.a.run.app',
        'https://api-github-my-branch.us-central1.run.app'
      ]);
    });

    it('should test API URL accessibility', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });

      const result = await testApiUrl('https://api.example.com');
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('Port Discovery Integration', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });
    });

    it('should find API port in E2E mode', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });

      const port = await findApiPort();
      
      expect(port).toBe('3015');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3015/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should find API port in manual test mode', async () => {
      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'true'
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });

      const port = await findApiPort();
      
      expect(port).toBe('3005');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3005/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should cache discovered ports', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });

      const port1 = await getApiPort();
      const port2 = await getApiPort();
      
      expect(port1).toBe(port2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('URL Resolution Integration', () => {
    it('should resolve to test override URL', async () => {
      (window as any).__TEST_API_URL__ = 'http://test-override.com';
      
      const url = await getApiBaseUrl();
      
      expect(url).toBe('http://test-override.com');
    });

    it('should resolve to environment variable URL', async () => {
      (window as any).__ENV__ = {
        REACT_APP_API_BASE_URL: 'https://env-var-api.com'
      };
      
      const url = await getApiBaseUrl();
      
      expect(url).toBe('https://env-var-api.com');
    });

    it('should resolve to production URL in production mode', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp.com' },
        writable: true,
        configurable: true
      });
      
      const url = await getApiBaseUrl();
      
      expect(url).toBe('https://api-github-main-329000596728.us-central1.run.app');
    });

    it('should resolve to local URL in development mode', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });
      
      const url = await getApiBaseUrl();
      
      expect(url).toBe('http://localhost:3015');
    });

    it('should handle branch deployment URL discovery', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-123-abc123.web.app' },
        writable: true,
        configurable: true
      });

      global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: true, status: 200 }); // First API test succeeds
      
      const url = await getApiBaseUrl();
      
      expect(url).toMatch(/^https:\/\/api-github-.+\.(a|us-central1)\.run\.app$/);
    });
  });

  describe('End-to-End Integration Scenarios', () => {
    it('should handle complete local development workflow', async () => {
      // Set up local development environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      (window as any).__ENV__ = {
        REACT_APP_TEST_MODE: 'true'
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200
      });

      // Test environment detection
      expect(isDevelopment()).toBe(true);
      expect(isManualTestMode()).toBe(true);

      // Test port discovery
      const port = await getApiPort();
      expect(port).toBe('3005');

      // Test URL resolution
      const url = await getApiBaseUrl();
      expect(url).toBe('http://localhost:3005');

      // Verify API client can be configured
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
    });

    it('should handle complete branch deployment workflow', async () => {
      // Set up branch deployment environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'portfolio--branch-42-abc123.web.app' },
        writable: true,
        configurable: true
      });

      global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: false, status: 404 }) // First branch fails
        .mockResolvedValueOnce({ ok: true, status: 200 }); // Second branch succeeds

      // Test environment detection
      expect(isDevelopment()).toBe(false);
      expect(isManualTestMode()).toBe(false);

      // Test branch name extraction and cleaning
      const branches = extractPotentialBranchNames('42', 'abc123');
      expect(branches).toContain('abc123');
      expect(branches).toContain('bug-fix-gh-actions');

      const cleaned = cleanBranchName('bug-fix-gh-actions');
      expect(cleaned).toBe('bug-fix-gh-actions');

      // Test URL pattern generation
      const patterns = generateApiUrlPatterns(cleaned);
      expect(patterns).toEqual([
        'https://api-github-bug-fix-gh-actions.a.run.app',
        'https://api-github-bug-fix-gh-actions.us-central1.run.app'
      ]);

      // Test API URL testing
      const isAccessible = await testApiUrl(patterns[0]);
      expect(isAccessible).toBe(false);

      // Test complete URL resolution
      const url = await getApiBaseUrl();
      expect(url).toMatch(/^https:\/\/api-github-.+\.(a|us-central1)\.run\.app$/);
    });

    it('should handle complete production workflow', async () => {
      // Set up production environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'laurie-crean.dev' },
        writable: true,
        configurable: true
      });

      // Test environment detection
      expect(isDevelopment()).toBe(false);
      expect(isManualTestMode()).toBe(false);

      // Test URL resolution
      const url = await getApiBaseUrl();
      expect(url).toBe('https://api-github-main-329000596728.us-central1.run.app');

      // Test that API client is properly configured
      expect(apiClient).toBeDefined();
      expect(API_BASE_URL).toBeTruthy();
    });

    it('should handle error scenarios gracefully', async () => {
      // Set up error-prone environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      // Test that port discovery handles errors
      const port = await getApiPort();
      expect(port).toBe('3015'); // Falls back to default

      // Test environment utilities work despite errors
      expect(isDevelopment()).toBe(true);
      expect(getBrowserEnv('NON_EXISTENT', 'default')).toBe('default');

      // Test branch utilities work despite errors
      const branches = extractPotentialBranchNames('123', 'abc123');
      expect(branches.length).toBeGreaterThan(0);

      const cleaned = cleanBranchName('test/branch');
      expect(cleaned).toBe('test-branch');
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain compatibility with previous API client usage', () => {
      // Test that existing code patterns still work
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
      expect(typeof apiClient.put).toBe('function');
      expect(typeof apiClient.delete).toBe('function');
    });

    it('should maintain compatibility with previous utility imports', () => {
      // Test that all utilities are available as named exports
      expect(typeof getApiBaseUrl).toBe('function');
      expect(typeof getApiPort).toBe('function');
      expect(typeof isDevelopment).toBe('function');
      expect(typeof isManualTestMode).toBe('function');
    });

    it('should maintain API_BASE_URL constant', () => {
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL).toBeTruthy();
    });
  });
}); 