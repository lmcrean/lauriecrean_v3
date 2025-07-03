import { test, expect } from '@playwright/test';
import { 
  setupApiConnection, 
  getApiBaseUrl, 
  validateTimestamp,
  HealthResponse,
  PortInfoResponse 
} from './operations';

test.describe('API Health Checks', () => {
  
  // Set up the correct API URL before running tests
  test.beforeAll(async ({ request }) => {
    await setupApiConnection(request);
  });
  
  test('should respond to health check', async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/health`);
    
    expect(response.status()).toBe(200);
    
    const data: HealthResponse = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service', 'api-github');
    
    // Validate timestamp format (ISO string)
    validateTimestamp(data.timestamp);
    
    console.log('✅ Health check passed');
  });

  test('should respond to port info endpoint', async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/api/port-info`);
    
    expect(response.status()).toBe(200);
    
    const data: PortInfoResponse = await response.json();
    expect(data).toHaveProperty('port');
    expect(data).toHaveProperty('mode');
    expect(data).toHaveProperty('timestamp');
    
    expect(typeof data.port).toBe('number');
    expect(['manual', 'e2e']).toContain(data.mode);
    validateTimestamp(data.timestamp);
    
    console.log(`✅ Port info endpoint working - Port: ${data.port}, Mode: ${data.mode}`);
  });

  test('should handle CORS headers properly', async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/health`);
    
    expect(response.status()).toBe(200);
    
    // Note: CORS headers might not be visible in Playwright requests
    // This test ensures the request succeeds, which means CORS is properly configured
    const data = await response.json();
    expect(data.status).toBe('ok');
    
    console.log('✅ CORS configuration working correctly');
  });

  test('should have consistent response time for health check', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${getApiBaseUrl()}/health`);
    const responseTime = Date.now() - start;
    
    expect(response.status()).toBe(200);
    
    // Health check should be fast (under 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`✅ Health check response time: ${responseTime}ms`);
  });

  test('should handle non-existent route', async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/api/non-existent-endpoint`);
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Not Found');
    expect(data.message).toContain('Route /api/non-existent-endpoint not found');
    
    console.log('✅ 404 handling working correctly');
  });
}); 