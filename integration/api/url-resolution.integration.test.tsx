import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getApiBaseUrl } from '../../apps/web/src/components/api/discovery/urlResolution';

// Mock dependencies
vi.mock('../../apps/web/src/components/api/environment/browserEnv', () => ({
  getBrowserEnv: vi.fn()
}));

vi.mock('../../apps/web/src/components/api/environment/detection', () => ({
  isDevelopment: vi.fn()
}));

vi.mock('../../apps/web/src/components/api/discovery/portDiscovery', () => ({
  getApiPort: vi.fn()
}));

vi.mock('../../apps/web/src/components/api/discovery/branchDetection', () => ({
  cleanBranchName: vi.fn(),
  extractPotentialBranchNames: vi.fn(),
  getSystematicBranchPatterns: vi.fn(),
  testApiUrl: vi.fn(),
  generateApiUrlPatterns: vi.fn()
}));

import { getBrowserEnv } from '../../apps/web/src/components/api/environment/browserEnv';
import { isDevelopment } from '../../apps/web/src/components/api/environment/detection';
import { getApiPort } from '../../apps/web/src/components/api/discovery/portDiscovery';
import { 
  cleanBranchName, 
  extractPotentialBranchNames, 
  getSystematicBranchPatterns, 
  testApiUrl, 
  generateApiUrlPatterns 
} from '../../apps/web/src/components/api/discovery/branchDetection';

const mockGetBrowserEnv = vi.mocked(getBrowserEnv);
const mockIsDevelopment = vi.mocked(isDevelopment);
const mockGetApiPort = vi.mocked(getApiPort);
const mockCleanBranchName = vi.mocked(cleanBranchName);
const mockExtractPotentialBranchNames = vi.mocked(extractPotentialBranchNames);
const mockGetSystematicBranchPatterns = vi.mocked(getSystematicBranchPatterns);
const mockTestApiUrl = vi.mocked(testApiUrl);
const mockGenerateApiUrlPatterns = vi.mocked(generateApiUrlPatterns);

describe('URL Resolution Integration Tests', () => {
  let originalWindow: typeof window;
  let consoleLogSpy: any;

  beforeEach(() => {
    // Store original window
    originalWindow = window;
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock console to reduce noise
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Set up default mock implementations
    mockGetBrowserEnv.mockReturnValue(undefined);
    mockIsDevelopment.mockReturnValue(false);
    mockGetApiPort.mockResolvedValue('3015');
    mockCleanBranchName.mockImplementation((branch: string) => branch);
    mockExtractPotentialBranchNames.mockReturnValue(['branch-123', 'pr-123']);
    mockGetSystematicBranchPatterns.mockReturnValue(['systematic-branch-123']);
    mockTestApiUrl.mockResolvedValue(false);
    mockGenerateApiUrlPatterns.mockReturnValue([
      'https://api-github-branch.a.run.app',
      'https://api-github-branch.us-central1.run.app'
    ]);
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { hostname: 'example.com' },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore original window
    Object.defineProperty(window, 'location', {
      value: originalWindow.location,
      writable: true,
      configurable: true
    });
    
    // Clean up window modifications
    delete (window as any).__TEST_API_URL__;
    
    consoleLogSpy.mockRestore();
  });

  describe('Test Environment Override', () => {
    it('should use test API URL override when available', async () => {
      (window as any).__TEST_API_URL__ = 'http://test-api.example.com';
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('http://test-api.example.com');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test API URL override detected: http://test-api.example.com')
      );
    });
  });

  describe('Environment Variable Detection', () => {
    it('should use REACT_APP_API_BASE_URL when available', async () => {
      mockGetBrowserEnv
        .mockReturnValueOnce('https://react-app-api.example.com')
        .mockReturnValueOnce(undefined);
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://react-app-api.example.com');
      expect(mockGetBrowserEnv).toHaveBeenCalledWith('REACT_APP_API_BASE_URL', null);
    });

    it('should use DOCUSAURUS_API_BASE_URL when REACT_APP_API_BASE_URL is not available', async () => {
      mockGetBrowserEnv
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce('https://docusaurus-api.example.com');
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://docusaurus-api.example.com');
      expect(mockGetBrowserEnv).toHaveBeenCalledWith('DOCUSAURUS_API_BASE_URL', null);
    });

    it('should ignore undefined values from environment variables', async () => {
      mockGetBrowserEnv
        .mockReturnValueOnce('undefined')
        .mockReturnValueOnce('');
      mockIsDevelopment.mockReturnValue(false);
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-main-329000596728.us-central1.run.app');
    });
  });

  describe('Branch Deployment Discovery', () => {
    beforeEach(() => {
      mockIsDevelopment.mockReturnValue(false);
      mockGetBrowserEnv.mockReturnValue(undefined);
    });

    it('should detect Firebase branch deployment from hostname', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-123-abc123.web.app' },
        writable: true,
        configurable: true
      });

      mockExtractPotentialBranchNames.mockReturnValue(['abc123', 'branch-123']);
      mockCleanBranchName.mockImplementation((branch: string) => `cleaned-${branch}`);
      mockGenerateApiUrlPatterns.mockReturnValue([
        'https://api-github-cleaned-abc123.a.run.app',
        'https://api-github-cleaned-abc123.us-central1.run.app'
      ]);
      mockTestApiUrl.mockResolvedValueOnce(true);

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-cleaned-abc123.a.run.app');
      expect(mockExtractPotentialBranchNames).toHaveBeenCalledWith('123', 'abc123');
      expect(mockTestApiUrl).toHaveBeenCalledWith('https://api-github-cleaned-abc123.a.run.app');
    });

    it('should try multiple branch names until one works', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-456-def456.web.app' },
        writable: true,
        configurable: true
      });

      mockExtractPotentialBranchNames.mockReturnValue(['def456', 'branch-456', 'pr-456']);
      mockCleanBranchName.mockImplementation((branch: string) => `clean-${branch}`);
      mockGenerateApiUrlPatterns
        .mockReturnValueOnce(['https://api-github-clean-def456.a.run.app'])
        .mockReturnValueOnce(['https://api-github-clean-branch-456.a.run.app'])
        .mockReturnValueOnce(['https://api-github-clean-pr-456.a.run.app']);
      
      mockTestApiUrl
        .mockResolvedValueOnce(false) // First branch fails
        .mockResolvedValueOnce(true); // Second branch succeeds

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-clean-branch-456.a.run.app');
      expect(mockTestApiUrl).toHaveBeenCalledTimes(2);
    });

    it('should try systematic patterns when potential branches fail', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-789-ghi789.web.app' },
        writable: true,
        configurable: true
      });

      mockExtractPotentialBranchNames.mockReturnValue(['ghi789']);
      mockGetSystematicBranchPatterns.mockReturnValue(['systematic-pattern-789']);
      mockCleanBranchName.mockImplementation((branch: string) => `clean-${branch}`);
      
      mockGenerateApiUrlPatterns
        .mockReturnValueOnce(['https://api-github-clean-ghi789.a.run.app'])
        .mockReturnValueOnce(['https://api-github-clean-systematic-pattern-789.a.run.app']);
      
      mockTestApiUrl
        .mockResolvedValueOnce(false) // Potential branch fails
        .mockResolvedValueOnce(true); // Systematic pattern succeeds

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-clean-systematic-pattern-789.a.run.app');
      expect(mockGetSystematicBranchPatterns).toHaveBeenCalledWith('789');
    });

    it('should fallback to production when no branch deployment is found', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp--branch-999-hij999.web.app' },
        writable: true,
        configurable: true
      });

      mockExtractPotentialBranchNames.mockReturnValue(['hij999']);
      mockGetSystematicBranchPatterns.mockReturnValue(['systematic-999']);
      mockTestApiUrl.mockResolvedValue(false); // All API tests fail

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-main-329000596728.us-central1.run.app');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not find working branch API for PR #999')
      );
    });

    it('should skip branch deployment detection for non-branch hostnames', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp.web.app' },
        writable: true,
        configurable: true
      });

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-main-329000596728.us-central1.run.app');
      expect(mockExtractPotentialBranchNames).not.toHaveBeenCalled();
    });
  });

  describe('Development Mode', () => {
    it('should use local API discovery in development mode', async () => {
      mockIsDevelopment.mockReturnValue(true);
      mockGetApiPort.mockResolvedValue('3005');
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('http://localhost:3005');
      expect(mockGetApiPort).toHaveBeenCalled();
    });

    it('should handle port discovery failures in development mode', async () => {
      mockIsDevelopment.mockReturnValue(true);
      mockGetApiPort.mockRejectedValue(new Error('Port discovery failed'));
      
      // Should not throw, but handle gracefully
      await expect(getApiBaseUrl()).rejects.toThrow('Port discovery failed');
    });
  });

  describe('Production Mode', () => {
    it('should use production API URL when not in development and no branch deployment', async () => {
      mockIsDevelopment.mockReturnValue(false);
      mockGetBrowserEnv.mockReturnValue(undefined);
      
      Object.defineProperty(window, 'location', {
        value: { hostname: 'myapp.com' },
        writable: true,
        configurable: true
      });

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-main-329000596728.us-central1.run.app');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete branch deployment workflow', async () => {
      // Set up Firebase branch deployment scenario
      Object.defineProperty(window, 'location', {
        value: { hostname: 'portfolio--branch-42-abc123.web.app' },
        writable: true,
        configurable: true
      });

      mockIsDevelopment.mockReturnValue(false);
      mockGetBrowserEnv.mockReturnValue(undefined);
      
      // Mock branch detection workflow
      mockExtractPotentialBranchNames.mockReturnValue(['abc123', 'bug-fix-gh-actions', 'pr-42']);
      mockCleanBranchName.mockImplementation((branch: string) => 
        branch.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()
      );
      mockGenerateApiUrlPatterns.mockImplementation((branch: string) => [
        `https://api-github-${branch}.a.run.app`,
        `https://api-github-${branch}.us-central1.run.app`
      ]);
      
      // Mock API testing - second branch succeeds
      mockTestApiUrl
        .mockResolvedValueOnce(false) // abc123 fails
        .mockResolvedValueOnce(false) // abc123 .us-central1 fails
        .mockResolvedValueOnce(true); // bug-fix-gh-actions succeeds

      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://api-github-bug-fix-gh-actions.a.run.app');
      expect(mockExtractPotentialBranchNames).toHaveBeenCalledWith('42', 'abc123');
      expect(mockCleanBranchName).toHaveBeenCalledWith('bug-fix-gh-actions');
      expect(mockTestApiUrl).toHaveBeenCalledWith('https://api-github-bug-fix-gh-actions.a.run.app');
    });

    it('should handle development mode with test override', async () => {
      (window as any).__TEST_API_URL__ = 'http://test-override.localhost:3999';
      mockIsDevelopment.mockReturnValue(true);
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('http://test-override.localhost:3999');
      // Should not call development mode logic when test override is present
      expect(mockGetApiPort).not.toHaveBeenCalled();
    });

    it('should handle environment variable priority correctly', async () => {
      mockGetBrowserEnv
        .mockReturnValueOnce('https://react-env-api.com')
        .mockReturnValueOnce('https://docusaurus-env-api.com');
      
      const result = await getApiBaseUrl();
      
      expect(result).toBe('https://react-env-api.com');
      expect(mockGetBrowserEnv).toHaveBeenCalledWith('REACT_APP_API_BASE_URL', null);
      expect(mockGetBrowserEnv).toHaveBeenCalledWith('DOCUSAURUS_API_BASE_URL', null);
    });

    it('should log comprehensive debugging information', async () => {
      mockIsDevelopment.mockReturnValue(false);
      mockGetBrowserEnv.mockReturnValue(undefined);
      
      Object.defineProperty(window, 'location', {
        value: { hostname: 'production.example.com' },
        writable: true,
        configurable: true
      });

      await getApiBaseUrl();
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('getApiBaseUrl: isDevelopment=false')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Checking for branch deployment environment variables')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Production mode, using:')
      );
    });
  });
}); 