import express from 'express';
import { GitHubService } from '../../github';
import { setupCorsValidation } from './cors';
import { setupEnvironmentValidation } from './environment';
import { setupDeploymentValidation } from './deployment';
import { setupIntegrationValidation } from './integration';

/**
 * Setup all validation routes
 */
export function setupValidationRoutes(app: express.Application, githubService: GitHubService): void {
  // Setup individual validation endpoints
  setupCorsValidation(app);
  setupEnvironmentValidation(app);
  setupDeploymentValidation(app);
  setupIntegrationValidation(app, githubService);

  console.log('✅ All validation routes configured');
} 