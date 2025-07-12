import { expect } from '@playwright/test';
import { PullRequestResponse, PaginationMeta } from './types.api';
import { isLocalDevelopmentTest } from './config.api';

// Utility functions for common validations
export function validatePullRequestStructure(pr: PullRequestResponse): void {
  // Basic properties
  expect(pr).toHaveProperty('id');
  expect(pr).toHaveProperty('number');
  expect(pr).toHaveProperty('title');
  expect(pr).toHaveProperty('description');
  expect(pr).toHaveProperty('created_at');
  expect(pr).toHaveProperty('merged_at');
  expect(pr).toHaveProperty('html_url');
  expect(pr).toHaveProperty('state');
  expect(pr).toHaveProperty('repository');
  
  // Type validations
  expect(typeof pr.id).toBe('number');
  expect(typeof pr.number).toBe('number');
  expect(typeof pr.title).toBe('string');
  expect(['open', 'closed', 'merged']).toContain(pr.state);
  
  // Repository structure
  expect(pr.repository).toHaveProperty('name');
  expect(pr.repository).toHaveProperty('description');
  expect(pr.repository).toHaveProperty('language');
  expect(pr.repository).toHaveProperty('html_url');
  
  // URL validations
  expect(pr.html_url).toMatch(/^https:\/\/github\.com\//);
  expect(pr.repository.html_url).toMatch(/^https:\/\/github\.com\//);
}

export function validatePaginationStructure(pagination: PaginationMeta): void {
  expect(pagination).toHaveProperty('page');
  expect(pagination).toHaveProperty('per_page');
  expect(pagination).toHaveProperty('total_count');
  expect(pagination).toHaveProperty('total_pages');
  expect(pagination).toHaveProperty('has_next_page');
  expect(pagination).toHaveProperty('has_previous_page');
}

export function validateTimestamp(timestamp: string): void {
  expect(new Date(timestamp).toISOString()).toBe(timestamp);
}

export function validateCacheHeaders(headers: Record<string, string>): void {
  const cacheControl = headers['cache-control'];
  // In development mode, cache headers might not be set
  if (isLocalDevelopmentTest()) {
    // Just check if it exists, don't enforce specific values in dev mode
    if (cacheControl) {
      expect(typeof cacheControl).toBe('string');
    }
  } else {
    // In production, enforce specific cache headers
    expect(cacheControl).toBe('public, max-age=900');
  }
} 