"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPullRequestDetails = fetchPullRequestDetails;
const rateLimitUtils_1 = require("../../utils/rateLimitUtils");
const helpers_1 = require("./helpers");
/**
 * Fetch detailed information for a specific pull request
 * Includes additional data like commits, additions, deletions, and comments count
 */
async function fetchPullRequestDetails(octokit, owner, repo, pullNumber) {
    console.log(`🔍 Fetching PR #${pullNumber} from ${owner}/${repo}`);
    // Validate parameters
    (0, helpers_1.validatePullRequestParams)(owner, repo, pullNumber);
    // Check if we have sufficient rate limit for this operation
    const hasRateLimit = await (0, rateLimitUtils_1.ensureSufficientRateLimit)(octokit, 'pull_request_details');
    if (!hasRateLimit) {
        throw new Error('Insufficient GitHub API rate limit for pull request details operation');
    }
    // Fetch PR details and comments count in parallel for better performance with retry logic
    const [prResponse, commentsResponse] = await Promise.all([
        (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: pullNumber
        })),
        (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number: pullNumber // PR comments are stored as issue comments
        }))
    ]);
    const pr = prResponse.data;
    const commentsCount = commentsResponse.data.length;
    const detailedPR = {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        description: pr.body || null,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        merged_at: pr.merged_at,
        closed_at: pr.closed_at,
        html_url: pr.html_url,
        state: pr.merged_at ? 'merged' : pr.state,
        draft: pr.draft || false,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changed_files: pr.changed_files,
        comments: commentsCount, // Include comments count for 💬 display
        author: {
            login: pr.user?.login || 'unknown',
            avatar_url: pr.user?.avatar_url || '',
            html_url: pr.user?.html_url || ''
        },
        repository: {
            name: repo,
            description: pr.base.repo.description,
            language: pr.base.repo.language ?? null,
            html_url: pr.base.repo.html_url
        }
    };
    console.log(`✅ Successfully fetched PR #${pullNumber}: "${pr.title}" with ${commentsCount} comments`);
    console.log(`📊 PR stats: ${(0, helpers_1.formatPRStats)(detailedPR)}`);
    return detailedPR;
}
// Re-export helpers for convenience
__exportStar(require("./helpers"), exports);
//# sourceMappingURL=index.js.map