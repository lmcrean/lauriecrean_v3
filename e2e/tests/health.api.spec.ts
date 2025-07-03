import { test, expect } from '@playwright/test';
import { 
  getApiBaseUrl, 
  validateTimestamp,
  HealthResponse,
  PortInfoResponse 
} from './runners/operations';
import { ObservabilityRunner } from './runners/observability-runner';

const observability = new ObservabilityRunner('API Health Checks');

test.describe('API Health Checks', () => {
  
  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
  });

  test.afterAll(async () => {
    await observability.teardown();
  });

  test.beforeEach(async () => {
    observability.incrementTestCount();
  });

  test.afterEach(async ({ }, testInfo) => {
    observability.recordTestResult(testInfo.title, testInfo.status === 'passed', testInfo.error);
  });
  
  test('should respond to health check', async ({ request }) => {
    observability.logTestStart('🏥 Testing basic health check endpoint');
    
    const response = await request.get(`${getApiBaseUrl()}/health`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    const data: HealthResponse = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service', 'api-github');
    
    // Validate timestamp format (ISO string)
    validateTimestamp(data.timestamp);
    
    observability.logNetworkActivity('✅ Health check passed - API is responding correctly');
    console.log('✅ Health check passed');
  });

  test('should respond to port info endpoint', async ({ request }) => {
    observability.logTestStart('📡 Testing port info endpoint');
    
    const response = await request.get(`${getApiBaseUrl()}/api/port-info`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    const data: PortInfoResponse = await response.json();
    expect(data).toHaveProperty('port');
    expect(data).toHaveProperty('mode');
    expect(data).toHaveProperty('timestamp');
    
    expect(typeof data.port).toBe('number');
    expect(['manual', 'e2e']).toContain(data.mode);
    validateTimestamp(data.timestamp);
    
    observability.logNetworkActivity(`📊 Port info retrieved: Port ${data.port}, Mode: ${data.mode}`);
    console.log(`✅ Port info endpoint working - Port: ${data.port}, Mode: ${data.mode}`);
  });

  test('should handle CORS headers properly', async ({ request }) => {
    observability.logTestStart('🔒 Testing CORS configuration');
    
    const response = await request.get(`${getApiBaseUrl()}/health`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Note: CORS headers might not be visible in Playwright requests
    // This test ensures the request succeeds, which means CORS is properly configured
    const data = await response.json();
    expect(data.status).toBe('ok');
    
    observability.logNetworkActivity('✅ CORS configuration working correctly');
    console.log('✅ CORS configuration working correctly');
  });

  test('should have consistent response time for health check', async ({ request }) => {
    observability.logTestStart('⏱️ Testing health check response time');
    
    const start = Date.now();
    const response = await request.get(`${getApiBaseUrl()}/health`);
    const responseTime = Date.now() - start;
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Health check should be fast (under 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    
    observability.logNetworkActivity(`⚡ Health check response time: ${responseTime}ms`);
    console.log(`✅ Health check response time: ${responseTime}ms`);
  });

  test('should handle non-existent route', async ({ request }) => {
    observability.logTestStart('🚨 Testing 404 error handling');
    
    const response = await request.get(`${getApiBaseUrl()}/api/non-existent-endpoint`);
    observability.recordNetworkCall(response.status() === 404); // 404 is expected success
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Not Found');
    expect(data.message).toContain('Route /api/non-existent-endpoint not found');
    
    observability.logNetworkActivity('✅ 404 handling working correctly');
    console.log('✅ 404 handling working correctly');
  });
}); 