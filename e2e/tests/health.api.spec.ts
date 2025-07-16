import { test, expect } from '@playwright/test';

// Interface for the enhanced health response
interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  github_token: {
    present: boolean;
    length: number;
    valid_format: boolean;
    status: string;
  };
}

test.describe('API Health Checks - GITHUB_TOKEN Validation', () => {
  
  test('should validate GITHUB_TOKEN is present and configured', async ({ request }) => {
    console.log('🔍 Testing GITHUB_TOKEN configuration...');
    
    const response = await request.get('http://localhost:3015/health');
    expect(response.status()).toBe(200);
    
    const healthData: HealthResponse = await response.json();
    
    // Basic health check assertions
    expect(healthData.status).toBe('ok');
    expect(healthData.service).toBe('api-github');
    expect(healthData.timestamp).toBeTruthy();
    
    // GITHUB_TOKEN specific assertions
    console.log('🔑 GITHUB_TOKEN Status:', healthData.github_token);
    
    expect(healthData.github_token).toBeDefined();
    expect(healthData.github_token.present).toBe(true);
    expect(healthData.github_token.status).toBe('configured');
    expect(healthData.github_token.length).toBeGreaterThan(0);
    
    // Check if token has valid format (starts with ghp_ or github_pat_)
    expect(healthData.github_token.valid_format).toBe(true);
    
    console.log('✅ GITHUB_TOKEN is properly configured!');
    console.log(`📏 Token length: ${healthData.github_token.length} characters`);
  });

  test('should have healthy status when GITHUB_TOKEN is present', async ({ request }) => {
    console.log('🏥 Testing overall health status...');
    
    const response = await request.get('http://localhost:3015/health');
    expect(response.status()).toBe(200);
    
    const healthData: HealthResponse = await response.json();
    
    // Should be 'ok' when token is present, 'warning' when missing
    expect(healthData.status).toBe('ok');
    
    console.log('✅ API health status is OK');
  });

  test('should respond quickly to health check', async ({ request }) => {
    console.log('⏱️ Testing health check response time...');
    
    const start = Date.now();
    const response = await request.get('http://localhost:3015/health');
    const responseTime = Date.now() - start;
    
    expect(response.status()).toBe(200);
    
    // Health check should be fast (under 2 seconds)
    expect(responseTime).toBeLessThan(2000);
    
    console.log(`⚡ Health check response time: ${responseTime}ms`);
  });

  test('should validate timestamp format', async ({ request }) => {
    console.log('📅 Testing timestamp format...');
    
    const response = await request.get('http://localhost:3015/health');
    expect(response.status()).toBe(200);
    
    const healthData: HealthResponse = await response.json();
    
    // Validate timestamp is a valid ISO string
    const timestamp = new Date(healthData.timestamp);
    expect(timestamp.toISOString()).toBe(healthData.timestamp);
    
    // Timestamp should be recent (within last 5 seconds)
    const timeDiff = Date.now() - timestamp.getTime();
    expect(timeDiff).toBeLessThan(5000);
    
    console.log(`✅ Timestamp is valid: ${healthData.timestamp}`);
  });

  test('should validate API service identification', async ({ request }) => {
    console.log('🏷️ Testing service identification...');
    
    const response = await request.get('http://localhost:3015/health');
    expect(response.status()).toBe(200);
    
    const healthData: HealthResponse = await response.json();
    
    expect(healthData.service).toBe('api-github');
    
    console.log('✅ Service correctly identified as api-github');
  });
}); 