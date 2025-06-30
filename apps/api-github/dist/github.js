"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequests = getPullRequests;
exports.getPullRequestDetails = getPullRequestDetails;
const rest_1 = require("@octokit/rest");
const octokit = new rest_1.Octokit({
    auth: process.env.GITHUB_TOKEN
});
// Debug logging
console.log('GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);
async function getPullRequests(username, page = 1, perPage = 20) {
    try {
        // Use GitHub search API to get the most recent PRs across ALL repositories
        const searchQuery = `author:${username} type:pr`;
        console.log(`Searching for PRs by ${username} using GitHub Search API (page ${page})`);
        // Calculate how many results we need to fetch
        const resultsNeeded = page * perPage;
        const searchPage = Math.ceil(resultsNeeded / 100); // GitHub search returns max 100 per page
        const { data: searchResults } = await octokit.rest.search.issuesAndPullRequests({
            q: searchQuery,
            sort: 'created',
            order: 'desc',
            per_page: Math.min(100, resultsNeeded), // Get exactly what we need, up to 100
            page: searchPage
        });
        console.log(`Found ${searchResults.total_count} total PRs for ${username} via search`);
        // If we need more results for higher pages, fetch additional pages
        let allSearchItems = [...searchResults.items];
        if (resultsNeeded > 100 && searchResults.items.length === 100) {
            // We need to fetch more pages
            const additionalPagesNeeded = Math.ceil((resultsNeeded - 100) / 100);
            for (let i = 2; i <= additionalPagesNeeded + 1; i++) {
                try {
                    const { data: additionalResults } = await octokit.rest.search.issuesAndPullRequests({
                        q: searchQuery,
                        sort: 'created',
                        order: 'desc',
                        per_page: 100,
                        page: i
                    });
                    allSearchItems.push(...additionalResults.items);
                    if (additionalResults.items.length < 100) {
                        break; // No more results
                    }
                }
                catch (error) {
                    console.warn(`Failed to fetch search page ${i}:`, error);
                    break;
                }
            }
        }
        // Convert search results to our format
        const allPRs = [];
        // Only process the items we need for the current page
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const itemsToProcess = allSearchItems.slice(0, endIndex);
        for (const item of itemsToProcess) {
            try {
                // Extract owner and repo from the URL
                const urlParts = item.html_url.split('/');
                const owner = urlParts[3];
                const repo = urlParts[4];
                // Get the full PR details
                const { data: pr } = await octokit.rest.pulls.get({
                    owner,
                    repo,
                    pull_number: item.number
                });
                // Get repository details
                const { data: repoData } = await octokit.rest.repos.get({
                    owner,
                    repo
                });
                const prData = {
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
                allPRs.push(prData);
            }
            catch (prError) {
                console.warn(`Failed to fetch details for PR ${item.number}:`, prError);
                continue;
            }
        }
        // Sort by creation date (newest first) - this should already be sorted by search API
        const sortedPRs = allPRs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        // Get the correct page of results
        const paginatedPRs = sortedPRs.slice(startIndex, endIndex);
        // Calculate pagination metadata
        const totalCount = searchResults.total_count; // Use actual total from search
        const totalPages = Math.ceil(totalCount / perPage);
        const pagination = {
            page,
            per_page: perPage,
            total_count: totalCount,
            total_pages: totalPages,
            has_next_page: page < totalPages,
            has_previous_page: page > 1
        };
        console.log(`Returning ${paginatedPRs.length} PRs for ${username} (page ${page}/${totalPages}, total: ${totalCount})`);
        console.log(`Most recent PR: ${paginatedPRs[0]?.title} (${paginatedPRs[0]?.created_at})`);
        return {
            pullRequests: paginatedPRs,
            pagination
        };
    }
    catch (error) {
        console.error(`Failed to fetch pull requests for ${username}:`, error);
        throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
}
async function getPullRequestDetails(owner, repo, pullNumber) {
    try {
        console.log(`Fetching PR #${pullNumber} from ${owner}/${repo}`);
        // Fetch PR details and comments count in parallel for better performance
        const [prResponse, commentsResponse] = await Promise.all([
            octokit.rest.pulls.get({
                owner,
                repo,
                pull_number: pullNumber
            }),
            octokit.rest.issues.listComments({
                owner,
                repo,
                issue_number: pullNumber // PR comments are stored as issue comments
            })
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
        console.log(`Successfully fetched PR #${pullNumber}: "${pr.title}" with ${commentsCount} comments`);
        return detailedPR;
    }
    catch (error) {
        console.error(`Failed to fetch PR #${pullNumber} from ${owner}/${repo}:`, error);
        throw new Error(`GitHub API error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
}
//# sourceMappingURL=github.js.map