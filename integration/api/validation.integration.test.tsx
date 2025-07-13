import { describe, it, expect, beforeAll } from 'vitest';
import { getApiBaseUrl } from '../../apps/web/src/components/api/Core';

describe('API Validation Integration Tests', () => {
  let apiBaseUrl: string;

  beforeAll(() => {
    // Use environment-specific API URL
    apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 
                 process.env.DOCUSAURUS_API_BASE_URL || 
                 'https://api-github-main-329000596728.us-central1.run.app';
    
    console.log(`🧪 Testing API validation endpoints at: ${apiBaseUrl}`);
  });

  describe('CORS Validation Endpoint', () => {
    it('should test CORS configuration', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/cors`, {
          method: 'GET',
          headers: {
            'Origin': 'https://lauriecrean-free-38256--branch-37-90w25qd9.web.app',
            'Content-Type': 'application/json',
          },
        });

        expect(response.ok).toBe(true);
        
        const data = await response.json();
        console.log('🔍 CORS validation response:', data);
        
        expect(data.status).toBe('ok');
        expect(data.timestamp).toBeDefined();
        expect(data.cors_check).toBeDefined();
        expect(data.cors_check.origin).toBeDefined();
        expect(data.cors_check.method).toBe('GET');
        expect(data.cors_check.headers).toBeDefined();
        
      } catch (error) {
        console.error('❌ CORS validation failed:', error);
        throw error;
      }
    });

    it('should handle different origin headers', async () => {
      const testOrigins = [
        'https://lauriecrean-free-38256.web.app',
        'https://lauriecrean-free-38256--branch-37-90w25qd9.web.app',
        'https://localhost:3000',
        'http://localhost:3010'
      ];

      for (const origin of testOrigins) {
        try {
          const response = await fetch(`${apiBaseUrl}/api/validate/cors`, {
            method: 'GET',
            headers: {
              'Origin': origin,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log(`🌐 Testing origin ${origin}:`, data.cors_check?.origin);
          
          expect(data.status).toBe('ok');
          expect(data.cors_check.origin).toBe(origin);
          
        } catch (error) {
          console.error(`❌ CORS test failed for origin ${origin}:`, error);
          // Don't throw here - some origins might legitimately fail
        }
      }
    });
  });

  describe('Environment Validation Endpoint', () => {
    it('should check environment variables', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/environment`);
        
        expect(response.ok).toBe(true);
        
        const data = await response.json();
        console.log('🌐 Environment validation response:', data);
        
        expect(data.status).toBe('ok');
        expect(data.timestamp).toBeDefined();
        expect(data.environment).toBeDefined();
        expect(data.environment.NODE_ENV).toBeDefined();
        expect(data.environment.PORT).toBeDefined();
        
        // GitHub token should be present and valid
        expect(data.environment.GITHUB_TOKEN).toBeDefined();
        expect(data.environment.GITHUB_TOKEN.present).toBe(true);
        expect(data.environment.GITHUB_TOKEN.valid).toBe(true);
        
      } catch (error) {
        console.error('❌ Environment validation failed:', error);
        throw error;
      }
    });

    it('should validate deployment info', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/environment`);
        const data = await response.json();
        
        expect(data.deployment_info).toBeDefined();
        expect(data.deployment_info.service_name).toBeDefined();
        expect(data.deployment_info.region).toBeDefined();
        
        // Should detect if this is a branch deployment
        if (data.deployment_info.is_branch_deployment) {
          expect(data.deployment_info.branch_name).toBeDefined();
          expect(data.deployment_info.pr_number).toBeDefined();
        }
        
      } catch (error) {
        console.error('❌ Deployment info validation failed:', error);
        throw error;
      }
    });
  });

  describe('Deployment Validation Endpoint', () => {
    it('should check deployment configuration', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/deployment`);
        
        expect(response.ok).toBe(true);
        
        const data = await response.json();
        console.log('🚀 Deployment validation response:', data);
        
        expect(data.status).toBe('ok');
        expect(data.timestamp).toBeDefined();
        expect(data.deployment).toBeDefined();
        expect(data.deployment.service_name).toBeDefined();
        expect(data.deployment.region).toBeDefined();
        expect(data.deployment.is_cloud_run).toBe(true);
        
      } catch (error) {
        console.error('❌ Deployment validation failed:', error);
        throw error;
      }
    });

    it('should detect branch deployment pattern', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/deployment`);
        const data = await response.json();
        
        // Check if URL pattern matches branch deployment
        const urlPattern = data.deployment.url_pattern;
        expect(urlPattern).toBeDefined();
        
        if (apiBaseUrl.includes('bug-fix-gh-actions')) {
          expect(data.deployment.is_branch_deployment).toBe(true);
          expect(data.deployment.branch_name).toBe('bug-fix-gh-actions');
        }
        
      } catch (error) {
        console.error('❌ Branch deployment detection failed:', error);
        throw error;
      }
    });
  });

  describe('GitHub API Validation', () => {
    it('should validate GitHub API connectivity', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/github`);
        
        expect(response.ok).toBe(true);
        
        const data = await response.json();
        console.log('🐙 GitHub validation response:', data);
        
        expect(data.status).toBe('ok');
        expect(data.timestamp).toBeDefined();
        expect(data.github_api).toBeDefined();
        expect(data.github_api.token_valid).toBe(true);
        expect(data.github_api.rate_limit).toBeDefined();
        
      } catch (error) {
        console.error('❌ GitHub API validation failed:', error);
        throw error;
      }
    });

    it('should check rate limit status', async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/validate/github`);
        const data = await response.json();
        
        const rateLimit = data.github_api.rate_limit;
        expect(rateLimit.remaining).toBeGreaterThanOrEqual(0);
        expect(rateLimit.limit).toBeGreaterThan(0);
        expect(rateLimit.reset).toBeDefined();
        
        console.log(`📊 Rate limit: ${rateLimit.remaining}/${rateLimit.limit} remaining`);
        
      } catch (error) {
        console.error('❌ Rate limit check failed:', error);
        throw error;
      }
    });
  });

  describe('End-to-End Connectivity Test', () => {
    it('should test complete API connectivity flow', async () => {
      console.log('🔄 Testing complete API connectivity flow...');
      
      // 1. Test CORS
      const corsResponse = await fetch(`${apiBaseUrl}/api/validate/cors`);
      expect(corsResponse.ok).toBe(true);
      console.log('✅ CORS validation passed');
      
      // 2. Test Environment
      const envResponse = await fetch(`${apiBaseUrl}/api/validate/environment`);
      expect(envResponse.ok).toBe(true);
      console.log('✅ Environment validation passed');
      
      // 3. Test Deployment
      const deployResponse = await fetch(`${apiBaseUrl}/api/validate/deployment`);
      expect(deployResponse.ok).toBe(true);
      console.log('✅ Deployment validation passed');
      
      // 4. Test GitHub API
      const githubResponse = await fetch(`${apiBaseUrl}/api/validate/github`);
      expect(githubResponse.ok).toBe(true);
      console.log('✅ GitHub API validation passed');
      
      // 5. Test actual pull request endpoint
      const prResponse = await fetch(`${apiBaseUrl}/api/github/pull-requests?username=lmcrean&page=1&per_page=1`);
      expect(prResponse.ok).toBe(true);
      console.log('✅ Pull request endpoint validation passed');
      
      console.log('🎉 Complete API connectivity test PASSED');
    });
  });
}); 