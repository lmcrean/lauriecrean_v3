import { APIRequestContext } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';
import { getApiBaseUrl, DetailedPullRequestResponse, ErrorResponse } from '../utilities/utilities.api';

export interface PullRequestDetailConfig {
  owner: string;
  repo: string;
  number: number;
  timeout: number;
}

export class PullRequestDetailApiRunner {
  private logger: E2ELogger;

  constructor(logger: E2ELogger) {
    this.logger = logger;
  }

  async fetchPullRequestDetails(
    request: APIRequestContext, 
    config: PullRequestDetailConfig
  ): Promise<{ success: boolean; data?: DetailedPullRequestResponse; error?: ErrorResponse; status?: number }> {
    
    this.logger.logInfo(`🔍 Fetching detailed PR #${config.number} from ${config.owner}/${config.repo}...`, 'network');
    
    try {
      const apiUrl = `${getApiBaseUrl()}/api/github/pull-requests/${config.owner}/${config.repo}/${config.number}`;
      
      const response = await request.get(apiUrl, {
        timeout: config.timeout
      });
      
      const status = response.status();
      
      if (status === 200) {
        const data: DetailedPullRequestResponse = await response.json();
        this.logger.logInfo(`✅ Successfully fetched PR details`, 'network', { 
          title: data.title,
          commits: data.commits,
          additions: data.additions,
          deletions: data.deletions,
          changed_files: data.changed_files
        });
        return { success: true, data, status };
      } else {
        const error: ErrorResponse = await response.json();
        this.logger.logError(`❌ Failed to fetch PR details`, 'network', { 
          status, 
          error: error.error,
          message: error.message 
        });
        return { success: false, error, status };
      }
    } catch (err: any) {
      this.logger.logError(`❌ API call failed`, 'network', { error: err.message });
      return { success: false, error: { error: 'Network Error', message: err.message } };
    }
  }

  async validatePullRequestDetailStructure(data: DetailedPullRequestResponse): Promise<boolean> {
    this.logger.logInfo('🔍 Validating pull request detail structure...', 'test');
    
    try {
      // Basic PR fields
      const basicFields = ['id', 'number', 'title', 'description', 'created_at', 'merged_at', 'html_url', 'state', 'repository'];
      
      // Detailed fields
      const detailedFields = ['author', 'updated_at', 'closed_at', 'draft', 'commits', 'additions', 'deletions', 'changed_files', 'comments'];
      
      // Check all fields are present
      for (const field of [...basicFields, ...detailedFields]) {
        if (!data.hasOwnProperty(field)) {
          this.logger.logError(`❌ Missing field: ${field}`, 'test');
          return false;
        }
      }
      
      // Validate author structure
      if (!data.author.login || !data.author.avatar_url || !data.author.html_url) {
        this.logger.logError('❌ Invalid author structure', 'test');
        return false;
      }
      
      // Validate repository structure
      if (!data.repository.name || !data.repository.html_url) {
        this.logger.logError('❌ Invalid repository structure', 'test');
        return false;
      }
      
      // Validate number types
      const numericFields = ['id', 'number', 'commits', 'additions', 'deletions', 'changed_files', 'comments'];
      for (const field of numericFields) {
        if (typeof data[field as keyof DetailedPullRequestResponse] !== 'number') {
          this.logger.logError(`❌ Field ${field} should be a number`, 'test');
          return false;
        }
      }
      
      // Validate state
      if (!['open', 'closed', 'merged'].includes(data.state)) {
        this.logger.logError(`❌ Invalid state: ${data.state}`, 'test');
        return false;
      }
      
      // Validate URLs
      if (!data.html_url.startsWith('https://github.com/') || !data.repository.html_url.startsWith('https://github.com/')) {
        this.logger.logError('❌ Invalid GitHub URLs', 'test');
        return false;
      }
      
      this.logger.logInfo('✅ Pull request detail structure validation passed', 'test');
      return true;
      
    } catch (err: any) {
      this.logger.logError(`❌ Validation failed`, 'test', { error: err.message });
      return false;
    }
  }

  async testErrorHandling(
    request: APIRequestContext, 
    config: Partial<PullRequestDetailConfig>
  ): Promise<{ success: boolean; expectedError: boolean; status?: number; error?: ErrorResponse }> {
    
    this.logger.logInfo('🚨 Testing error handling...', 'test');
    
    try {
      const apiUrl = `${getApiBaseUrl()}/api/github/pull-requests/${config.owner || 'invalid'}/${config.repo || 'invalid'}/${config.number || 999}`;
      
      const response = await request.get(apiUrl, {
        timeout: config.timeout || 30000
      });
      
      const status = response.status();
      
      if (status >= 400) {
        const error: ErrorResponse = await response.json();
        this.logger.logInfo(`✅ Error handling working correctly`, 'test', { 
          status, 
          error: error.error,
          message: error.message 
        });
        return { success: true, expectedError: true, status, error };
      } else {
        this.logger.logError(`❌ Expected error but got success`, 'test', { status });
        return { success: false, expectedError: false, status };
      }
      
    } catch (err: any) {
      this.logger.logError(`❌ Error testing failed`, 'test', { error: err.message });
      return { success: false, expectedError: false, error: { error: 'Network Error', message: err.message } };
    }
  }
}
