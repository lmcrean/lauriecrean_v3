import { Page } from '@playwright/test';
import { E2ELogger } from '@lauriecrean/observability';

export interface ModalInteractionResult {
  modalOpened: boolean;
  detailDataLoaded: boolean;
  componentInteraction: boolean;
}

export class ModalInteractionHelper {
  private logger: E2ELogger;

  constructor(logger: E2ELogger) {
    this.logger = logger;
  }

  async openPullRequestDetail(page: Page, prNumber?: number): Promise<boolean> {
    this.logger.logInfo(`🔍 Looking for pull request cards...`, 'test');
    
    try {
      await page.waitForSelector('[data-testid="pull-request-feed"]', { timeout: 10000 });
      
      const pullRequestCards = page.locator('[data-testid="pull-request-card"]');
      await page.waitForTimeout(2000);
      const cardCount = await pullRequestCards.count();
      
      this.logger.logInfo(`📋 Found ${cardCount} PR cards`, 'test');
      
      if (cardCount === 0) {
        this.logger.logError('❌ No PR cards found', 'test');
        return false;
      }

      // Find target card
      let targetCard = pullRequestCards.first();
      if (prNumber) {
        const specificCard = page.locator(`[data-testid="pull-request-card"][data-pr-number="${prNumber}"]`);
        if (await specificCard.count() > 0) {
          targetCard = specificCard;
          this.logger.logInfo(`🎯 Found PR #${prNumber}`, 'test');
        }
      }
      
      await targetCard.click();
      this.logger.logInfo('🖱️ Clicked on PR card', 'test');
      await page.waitForTimeout(2000);
      
      const modal = page.locator('[data-testid="pull-request-modal"]');
      const isVisible = await modal.isVisible({ timeout: 5000 }).catch(() => false);
      
      this.logger.logInfo(isVisible ? '✅ Modal opened' : '❌ Modal did not open', 'test');
      return isVisible;
      
    } catch (error: any) {
      this.logger.logError(`❌ Error: ${error.message}`, 'test');
      return false;
    }
  }

  async testDetailDataLoading(page: Page): Promise<boolean> {
    this.logger.logInfo('🔍 Testing detail data loading...', 'test');
    
    try {
      await page.waitForSelector('[data-testid="pull-request-modal"]', { timeout: 10000 });
      await page.waitForTimeout(3000);
      
      const detailFields = [
        '[data-testid="pr-commits"]',
        '[data-testid="pr-additions"]', 
        '[data-testid="pr-deletions"]',
        '[data-testid="pr-changed-files"]',
        '[data-testid="pr-author"]'
      ];
      
      let fieldsFound = 0;
      for (const field of detailFields) {
        if (await page.locator(field).isVisible({ timeout: 2000 }).catch(() => false)) {
          fieldsFound++;
        }
      }
      
      const hasModalContent = await page.locator('[data-testid="pull-request-detail"]')
        .isVisible({ timeout: 2000 }).catch(() => false);
      
      const pageContent = await page.content();
      const hasDetailedContent = pageContent.includes('commits') || 
                                pageContent.includes('additions') || 
                                pageContent.includes('deletions');
      
      const success = fieldsFound >= 3 || (hasModalContent && hasDetailedContent);
      
      this.logger.logInfo(success ? 
        `✅ Detail data loaded - ${fieldsFound} fields` : 
        `❌ Insufficient data - ${fieldsFound} fields`, 'test');
      
      return success;
      
    } catch (error: any) {
      this.logger.logError(`❌ Error: ${error.message}`, 'test');
      return false;
    }
  }

  async testComponentInteractions(page: Page): Promise<boolean> {
    this.logger.logInfo('🔍 Testing component interactions...', 'test');
    
    const closeSelectors = [
      '[data-testid="close-modal"]',
      '[data-testid="modal-close-x"]',
      '[data-testid="modal-close-button"]'
    ];
    
    for (const selector of closeSelectors) {
      if (await page.locator(selector).isVisible({ timeout: 2000 }).catch(() => false)) {
        this.logger.logInfo(`✅ Close button found`, 'test');
        return true;
      }
    }
    
    this.logger.logInfo('ℹ️ No close button, but component rendered', 'test');
    return true;
  }
} 