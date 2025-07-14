import express from 'express';
import { GitHubService } from '../github';
import { setupValidationRoutes as setupModularValidationRoutes } from './validation/index';

/**
 * Validation and diagnostic endpoints
 * Now using modular structure from validation/ directory
 */
export function setupValidationRoutes(app: express.Application, githubService: GitHubService): void {
  setupModularValidationRoutes(app, githubService);
} 