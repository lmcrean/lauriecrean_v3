"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPullRequests = fetchPullRequests;
const rateLimitUtils_1 = require("./rateLimitUtils");
/**
 * Fetch pull requests for a user using GitHub's search API
 * This provides better coverage across all repositories the user has contributed to
 */
async function fetchPullRequests(octokit, username, page = 1, perPage = 20) {
    console.log(`🔍 Searching for PRs by ${username} using GitHub Search API (page ${page})`);
    // Check if we have sufficient rate limit for this operation
    const hasRateLimit = await (0, rateLimitUtils_1.ensureSufficientRateLimit)(octokit, 'pull_requests', perPage);
    if (!hasRateLimit) {
        throw new Error('Insufficient GitHub API rate limit for pull requests operation');
    }
    const searchQuery = `author:${username} type:pr`;
    // Calculate how many results we need to fetch to serve this page
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    // Fetch search results from GitHub
    const allSearchItems = await fetchSearchResults(octokit, searchQuery, endIndex);
    // Get total count for pagination
    const totalCount = await getTotalPullRequestCount(octokit, searchQuery);
    // Convert search results to our format with detailed data
    const allPRs = await convertSearchResultsToPRs(octokit, allSearchItems);
    // Sort by creation date (newest first)
    const sortedPRs = allPRs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    // Get the correct page of results
    const paginatedPRs = sortedPRs.slice(startIndex, endIndex);
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / perPage);
    const pagination = {
        page,
        per_page: perPage,
        total_count: totalCount,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_previous_page: page > 1
    };
    console.log(`✅ Returning ${paginatedPRs.length} PRs for ${username} (page ${page}/${totalPages}, total: ${totalCount})`);
    console.log(`📊 Fetched ${allPRs.length} total items, slicing ${startIndex}-${endIndex}`);
    if (paginatedPRs.length > 0) {
        console.log(`📄 First PR on this page: ${paginatedPRs[0]?.title} (${paginatedPRs[0]?.created_at})`);
    }
    return {
        pullRequests: paginatedPRs,
        pagination
    };
}
/**
 * Fetch search results from GitHub's search API with pagination support
 */
async function fetchSearchResults(octokit, searchQuery, itemsNeeded) {
    const githubPagesNeeded = Math.ceil(itemsNeeded / 100); // GitHub search returns max 100 per page
    let allSearchItems = [];
    for (let githubPage = 1; githubPage <= githubPagesNeeded; githubPage++) {
        const itemsToFetchThisPage = Math.min(100, itemsNeeded - ((githubPage - 1) * 100));
        if (itemsToFetchThisPage <= 0)
            break;
        try {
            const { data: searchResults } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.search.issuesAndPullRequests({
                q: searchQuery,
                sort: 'created',
                order: 'desc',
                per_page: itemsToFetchThisPage,
                page: githubPage
            }));
            allSearchItems.push(...searchResults.items);
            // Store total count from first page response
            if (githubPage === 1) {
                console.log(`📊 Found ${searchResults.total_count} total PRs via search`);
            }
            // If this page returned fewer items than requested, we've hit the end
            if (searchResults.items.length < itemsToFetchThisPage) {
                break;
            }
            // Add small delay between API calls to be respectful
            if (githubPage < githubPagesNeeded) {
                await (0, rateLimitUtils_1.delay)(100);
            }
        }
        catch (error) {
            console.warn(`⚠️ Failed to fetch GitHub search page ${githubPage}:`, error);
            break;
        }
    }
    return allSearchItems;
}
/**
 * Get total count of pull requests for pagination
 */
async function getTotalPullRequestCount(octokit, searchQuery) {
    try {
        const { data: countSearch } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.search.issuesAndPullRequests({
            q: searchQuery,
            sort: 'created',
            order: 'desc',
            per_page: 1,
            page: 1
        }));
        return countSearch.total_count;
    }
    catch (error) {
        console.warn('⚠️ Failed to get total PR count:', error);
        return 0;
    }
}
/**
 * Convert search results to detailed PR objects
 * Limits the number of detailed API calls to prevent rate limiting during tests
 */
async function convertSearchResultsToPRs(octokit, searchItems) {
    const allPRs = [];
    // Limit the number of detailed API calls to prevent rate limiting during tests
    const maxDetailedCalls = Math.min(searchItems.length, 20);
    console.log(`🔄 Processing ${maxDetailedCalls} PRs out of ${searchItems.length} found items`);
    for (let i = 0; i < maxDetailedCalls; i++) {
        const item = searchItems[i];
        try {
            const prData = await fetchDetailedPRData(octokit, item);
            allPRs.push(prData);
        }
        catch (prError) {
            console.warn(`⚠️ Failed to fetch details for PR ${item.number}:`, prError);
            continue;
        }
    }
    return allPRs;
}
/**
 * Fetch detailed data for a single pull request
 */
async function fetchDetailedPRData(octokit, item) {
    // Extract owner and repo from the URL
    const urlParts = item.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    // Get the full PR details with retry logic
    const { data: pr } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: item.number
    }));
    // Get repository details with retry logic
    const { data: repoData } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.repos.get({
        owner,
        repo
    }));
    // Add small delay between API calls to be respectful
    await (0, rateLimitUtils_1.delay)(50);
    return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        description: pr.body || null,
        created_at: pr.created_at,
        merged_at: pr.merged_at,
        html_url: pr.html_url,
        state: pr.merged_at ? 'merged' : pr.state,
        repository: {
            name: repo,
            description: repoData.description,
            language: repoData.language ?? null,
            html_url: repoData.html_url
        }
    };
}
//# sourceMappingURL=pullRequestsUtils.js.map