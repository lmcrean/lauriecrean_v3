"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPullRequestDetails = fetchPullRequestDetails;
exports.validatePullRequestParams = validatePullRequestParams;
exports.extractRepoInfoFromUrl = extractRepoInfoFromUrl;
exports.formatPRStats = formatPRStats;
const rateLimitUtils_1 = require("./rateLimitUtils");
/**
 * Fetch detailed information for a specific pull request
 * Includes additional data like commits, additions, deletions, and comments count
 */
async function fetchPullRequestDetails(octokit, owner, repo, pullNumber) {
    console.log(`🔍 Fetching PR #${pullNumber} from ${owner}/${repo}`);
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
    console.log(`📊 PR stats: ${pr.commits} commits, ${pr.additions}+ ${pr.deletions}- lines, ${pr.changed_files} files`);
    return detailedPR;
}
/**
 * Validate pull request parameters before making API calls
 */
function validatePullRequestParams(owner, repo, pullNumber) {
    if (!owner || !repo) {
        throw new Error('Owner and repository name are required');
    }
    if (!pullNumber || pullNumber <= 0) {
        throw new Error('Pull request number must be a positive integer');
    }
    if (isNaN(pullNumber)) {
        throw new Error('Pull request number must be a valid number');
    }
}
/**
 * Extract owner and repo from a GitHub PR URL
 * Useful for parsing URLs from search results
 */
function extractRepoInfoFromUrl(htmlUrl) {
    try {
        const urlParts = htmlUrl.split('/');
        if (urlParts.length < 5 || !urlParts[3] || !urlParts[4]) {
            throw new Error('Invalid GitHub URL format');
        }
        return {
            owner: urlParts[3],
            repo: urlParts[4]
        };
    }
    catch (error) {
        throw new Error(`Failed to extract repository info from URL: ${htmlUrl}`);
    }
}
/**
 * Format PR statistics for logging
 */
function formatPRStats(pr) {
    const state = pr.state.toUpperCase();
    const commits = pr.commits || 0;
    const additions = pr.additions || 0;
    const deletions = pr.deletions || 0;
    const files = pr.changed_files || 0;
    const comments = pr.comments || 0;
    return `[${state}] ${commits} commits, +${additions}/-${deletions} lines, ${files} files, ${comments} comments`;
}
//# sourceMappingURL=pullRequestDetailsUtils.js.map