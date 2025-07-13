import { E2ELogger } from '@lauriecrean/observability';
import { DetailedPullRequestResponse } from '../../utilities/utilities.api';

export class PullRequestDetailApiValidators {
  private logger: E2ELogger;

  constructor(logger: E2ELogger) {
    this.logger = logger;
  }

  async validateStructure(data: DetailedPullRequestResponse): Promise<boolean> {
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
      
      // Validate nested structures
      if (!this.validateAuthor(data.author)) return false;
      if (!this.validateRepository(data.repository)) return false;
      if (!this.validateNumericFields(data)) return false;
      if (!this.validateState(data.state)) return false;
      if (!this.validateUrls(data)) return false;
      
      this.logger.logInfo('✅ Pull request detail structure validation passed', 'test');
      return true;
      
    } catch (err: any) {
      this.logger.logError(`❌ Validation failed`, 'test', { error: err.message });
      return false;
    }
  }

  private validateAuthor(author: any): boolean {
    if (!author.login || !author.avatar_url || !author.html_url) {
      this.logger.logError('❌ Invalid author structure', 'test');
      return false;
    }
    return true;
  }

  private validateRepository(repository: any): boolean {
    if (!repository.name || !repository.html_url) {
      this.logger.logError('❌ Invalid repository structure', 'test');
      return false;
    }
    return true;
  }

  private validateNumericFields(data: DetailedPullRequestResponse): boolean {
    const numericFields = ['id', 'number', 'commits', 'additions', 'deletions', 'changed_files', 'comments'];
    for (const field of numericFields) {
      if (typeof data[field as keyof DetailedPullRequestResponse] !== 'number') {
        this.logger.logError(`❌ Field ${field} should be a number`, 'test');
        return false;
      }
    }
    return true;
  }

  private validateState(state: string): boolean {
    if (!['open', 'closed', 'merged'].includes(state)) {
      this.logger.logError(`❌ Invalid state: ${state}`, 'test');
      return false;
    }
    return true;
  }

  private validateUrls(data: DetailedPullRequestResponse): boolean {
    if (!data.html_url.startsWith('https://github.com/') || 
        !data.repository.html_url.startsWith('https://github.com/')) {
      this.logger.logError('❌ Invalid GitHub URLs', 'test');
      return false;
    }
    return true;
  }
} 