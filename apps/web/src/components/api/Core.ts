/**
 * API Core Module - Main Entry Point
 * 
 * This module serves as the central entry point for all API-related functionality.
 * It re-exports functions and utilities from specialized modules for clean organization.
 * 
 * Directory Structure:
 * - environment/: Environment detection and variable access
 * - discovery/: API endpoint discovery and URL resolution
 * - client/: HTTP client configuration
 */

// Environment utilities
export { getBrowserEnv } from './environment/browserEnv';
export { isDevelopment, isManualTestMode } from './environment/detection';

// API discovery utilities
export { findApiPort, getApiPort } from './discovery/portDiscovery';
export { getApiBaseUrl } from './discovery/urlResolution';
export {
  cleanBranchName,
  extractPotentialBranchNames,
  getSystematicBranchPatterns,
  testApiUrl,
  generateApiUrlPatterns
} from './discovery/branchDetection';

// HTTP client
export { default as apiClient, API_BASE_URL } from './client/axiosClient';

// Default export for backwards compatibility
export { default } from './client/axiosClient';
