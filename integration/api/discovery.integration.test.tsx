import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  findApiPort, 
  getApiPort 
} from '../../apps/web/src/components/api/discovery/portDiscovery';
import { 
  cleanBranchName, 
  extractPotentialBranchNames, 
  getSystematicBranchPatterns, 
  testApiUrl, 
  generateApiUrlPatterns 
} from '../../apps/web/src/components/api/discovery/branchDetection';

// Mock the environment detection to control test behavior
vi.mock('../../apps/web/src/components/api/environment/detection', () => ({
  isManualTestMode: vi.fn()
}));

import { isManualTestMode } from '../../apps/web/src/components/api/environment/detection';
const mockIsManualTestMode = vi.mocked(isManualTestMode);

describe('API Discovery Integration Tests', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Store original fetch
    originalFetch = global.fetch;
    
    // Reset mocks
    vi.clearAllMocks();
    mockIsManualTestMode.mockReturnValue(false);
    
    // Mock console to reduce noise
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    
    // Reset any cached values
    vi.clearAllMocks();
  });

  describe('Port Discovery', () => {
    describe('findApiPort', () => {
      it('should find API on first port in E2E mode', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
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

      it('should find API on first port in manual test mode', async () => {
        mockIsManualTestMode.mockReturnValue(true);
        
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

      it('should try multiple ports until one responds', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
        global.fetch = vi.fn()
          .mockRejectedValueOnce(new Error('Connection refused'))
          .mockRejectedValueOnce(new Error('Connection refused'))
          .mockResolvedValue({
            ok: true,
            status: 200
          });

        const port = await findApiPort();
        expect(port).toBe('3017');
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      it('should fallback to default port if all ports fail', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
        global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'));

        const port = await findApiPort();
        expect(port).toBe('3015');
        expect(global.fetch).toHaveBeenCalledTimes(5); // Try all 5 ports
      });

      it('should handle non-ok responses', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: false,
            status: 404
          })
          .mockResolvedValue({
            ok: true,
            status: 200
          });

        const port = await findApiPort();
        expect(port).toBe('3016');
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    describe('getApiPort', () => {
      it('should cache the discovered port', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200
        });

        const port1 = await getApiPort();
        const port2 = await getApiPort();
        
        expect(port1).toBe('3015');
        expect(port2).toBe('3015');
        expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to caching
      });

      it('should handle discovery failures gracefully', async () => {
        mockIsManualTestMode.mockReturnValue(false);
        
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const port = await getApiPort();
        expect(port).toBe('3015'); // Falls back to default
      });
    });
  });

  describe('Branch Detection', () => {
    describe('cleanBranchName', () => {
      it('should clean branch names according to GitHub Actions rules', () => {
        expect(cleanBranchName('feature/add-new-component')).toBe('feature-add-new-component');
        expect(cleanBranchName('bug-fix/cors-issues')).toBe('bug-fix-cors-issues');
        expect(cleanBranchName('refactor_api_endpoints')).toBe('refactor-api-endpoints');
        expect(cleanBranchName('Feature/Add-New-Component')).toBe('feature-add-new-component');
        expect(cleanBranchName('--multiple--hyphens--')).toBe('multiple-hyphens');
        expect(cleanBranchName('___underscores___')).toBe('underscores');
        expect(cleanBranchName('spaces and symbols!')).toBe('spaces-and-symbols');
      });

      it('should handle edge cases', () => {
        expect(cleanBranchName('')).toBe('');
        expect(cleanBranchName('---')).toBe('');
        expect(cleanBranchName('a')).toBe('a');
        expect(cleanBranchName('123')).toBe('123');
        expect(cleanBranchName('a-b-c')).toBe('a-b-c');
      });
    });

    describe('extractPotentialBranchNames', () => {
      const originalWindow = window;

      beforeEach(() => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
          value: { search: '' },
          writable: true,
          configurable: true
        });
        
        // Mock document
        Object.defineProperty(global, 'document', {
          value: { title: 'Test App' },
          writable: true,
          configurable: true
        });
      });

      afterEach(() => {
        Object.defineProperty(window, 'location', {
          value: originalWindow.location,
          writable: true,
          configurable: true
        });
      });

      it('should extract branch names from parameters', () => {
        const branches = extractPotentialBranchNames('123', 'abc123');
        
        expect(branches).toContain('abc123');
        expect(branches).toContain('bug-fix-gh-actions');
        expect(branches).toContain('pr-123');
        expect(branches).toContain('branch-123');
      });

      it('should extract branch from URL parameters', () => {
        Object.defineProperty(window, 'location', {
          value: { search: '?branch=feature-branch' },
          writable: true,
          configurable: true
        });

        const branches = extractPotentialBranchNames('456', 'def456');
        expect(branches).toContain('feature-branch');
      });

      it('should extract branch from document title', () => {
        Object.defineProperty(global, 'document', {
          value: { title: 'My App - branch: custom-branch - Testing' },
          writable: true,
          configurable: true
        });

        const branches = extractPotentialBranchNames('789', 'ghi789');
        expect(branches).toContain('custom-branch');
      });

      it('should filter out null values', () => {
        const branches = extractPotentialBranchNames('111', '');
        expect(branches).not.toContain(null);
        expect(branches).not.toContain('');
      });
    });

    describe('getSystematicBranchPatterns', () => {
      it('should generate systematic branch patterns', () => {
        const patterns = getSystematicBranchPatterns('42');
        
        expect(patterns).toContain('bug-fix-gh-actions');
        expect(patterns).toContain('feature-branch-42');
        expect(patterns).toContain('hotfix-42');
        expect(patterns).toContain('bugfix-42');
        expect(patterns).toContain('fix-branch-42');
        expect(patterns).toContain('dev-branch-42');
      });

      it('should include cleaned branch names', () => {
        const patterns = getSystematicBranchPatterns('123');
        
        expect(patterns).toContain('bug-fix-gh-actions-123');
        expect(patterns).toContain('feature-gh-actions-123');
        expect(patterns).toContain('fix-cors-issues-123');
      });
    });

    describe('testApiUrl', () => {
      it('should return true for accessible API URLs', async () => {
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

      it('should return false for inaccessible API URLs', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404
        });

        const result = await testApiUrl('https://api.example.com');
        expect(result).toBe(false);
      });

      it('should return false for network errors', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const result = await testApiUrl('https://api.example.com');
        expect(result).toBe(false);
      });

      it('should handle timeout', async () => {
        global.fetch = vi.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
        );

        const result = await testApiUrl('https://api.example.com', 50);
        expect(result).toBe(false);
      });
    });

    describe('generateApiUrlPatterns', () => {
      it('should generate both .a.run.app and .us-central1.run.app patterns', () => {
        const patterns = generateApiUrlPatterns('feature-branch');
        
        expect(patterns).toEqual([
          'https://api-github-feature-branch.a.run.app',
          'https://api-github-feature-branch.us-central1.run.app'
        ]);
      });

      it('should handle cleaned branch names', () => {
        const patterns = generateApiUrlPatterns('bug-fix-gh-actions');
        
        expect(patterns).toEqual([
          'https://api-github-bug-fix-gh-actions.a.run.app',
          'https://api-github-bug-fix-gh-actions.us-central1.run.app'
        ]);
      });

      it('should handle short branch names', () => {
        const patterns = generateApiUrlPatterns('fix');
        
        expect(patterns).toEqual([
          'https://api-github-fix.a.run.app',
          'https://api-github-fix.us-central1.run.app'
        ]);
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle branch detection and URL generation for a real PR', async () => {
      // Simulate a real branch detection workflow
      const prNumber = '123';
      const branchHash = 'abc123';
      
      // Extract potential branch names
      const potentialBranches = extractPotentialBranchNames(prNumber, branchHash);
      expect(potentialBranches.length).toBeGreaterThan(0);
      
      // Clean each branch name
      const cleanedBranches = potentialBranches.map(branch => 
        branch ? cleanBranchName(branch) : ''
      ).filter(Boolean);
      
      // Generate URL patterns for each cleaned branch
      const allUrlPatterns = cleanedBranches.flatMap(branch => 
        generateApiUrlPatterns(branch)
      );
      
      expect(allUrlPatterns.length).toBeGreaterThan(0);
      expect(allUrlPatterns[0]).toMatch(/^https:\/\/api-github-.+\.(a|us-central1)\.run\.app$/);
    });

    it('should handle port discovery workflow for local development', async () => {
      mockIsManualTestMode.mockReturnValue(true);
      
      // Mock API response for port 3005
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: 'ok', port: 3005 })
      });

      const port = await getApiPort();
      expect(port).toBe('3005');
      
      // Verify it was called with manual test mode ports
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3005/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle mixed environment scenarios', async () => {
      // Test systematic pattern generation
      const patterns = getSystematicBranchPatterns('42');
      expect(patterns).toContain('bug-fix-gh-actions');
      
      // Test URL generation for each pattern
      const urlPatterns = patterns.flatMap(pattern => 
        generateApiUrlPatterns(pattern)
      );
      
      expect(urlPatterns.length).toBe(patterns.length * 2); // 2 URL patterns per branch
      
      // Verify all URLs are properly formatted
      urlPatterns.forEach(url => {
        expect(url).toMatch(/^https:\/\/api-github-.+\.(a|us-central1)\.run\.app$/);
      });
    });
  });
}); 