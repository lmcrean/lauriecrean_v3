/**
 * API Core Module - Main Entry Point
 * 
 * Simple, reliable API module using runtime configuration.
 * Provides clean access to HTTP client and environment detection utilities.
 */

// Environment utilities (simplified)
export { isDevelopment, isManualTestMode } from './environment/detection';

// HTTP client (simplified with runtime config)
export { default as apiClient, API_BASE_URL } from './client/axiosClient';

// Default export for backwards compatibility
export { default } from './client/axiosClient';
