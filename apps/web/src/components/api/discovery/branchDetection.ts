/**
 * Branch deployment detection and parsing utilities
 * Handles Firebase branch deployment pattern detection and branch name parsing
 */

/**
 * Clean branch name the same way GitHub Actions does
 * Equivalent to: sed 's/[^a-zA-Z0-9-]/-/g' | tr '[:upper:]' '[:lower:]' | sed 's/--*/-/g' | sed 's/^-\\|-$//g'
 */
export const cleanBranchName = (branchName: string): string => {
  return branchName
    .replace(/[^a-zA-Z0-9-]/g, '-')  // Replace non-alphanumeric/hyphen with hyphen
    .toLowerCase()                    // Convert to lowercase
    .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
};

/**
 * Extract potential branch names from various sources
 * Returns array of possible branch names to test for API discovery
 */
export const extractPotentialBranchNames = (prNumber: string, branchHash: string): (string | null)[] => {
  return [
    // First try the hash extracted from the URL (most likely to work)
    branchHash,
    
    // Try to extract from URL hash if possible
    typeof window !== 'undefined' && window.location.search.includes('branch=') ? 
      new URLSearchParams(window.location.search).get('branch') : null,
    
    // Common branch patterns for this type of work
    'bug-fix-gh-actions',
    'fix-gh-actions', 
    'gh-actions-fix',
    'cors-fix',
    'api-fix',
    'deployment-fix',
    'branch-deployment-fix',
    
    // Generic patterns
    `pr-${prNumber}`,
    `branch-${prNumber}`,
    `fix-${prNumber}`,
    
    // Try getting from document title or meta tags
    typeof document !== 'undefined' && document.title.includes('branch:') ? 
      document.title.split('branch:')[1]?.trim().split(' ')[0] : null,
  ].filter(Boolean); // Remove null values
};

/**
 * Generate systematic branch name patterns for fallback search
 */
export const getSystematicBranchPatterns = (prNumber: string): string[] => {
  return [
    `bug-fix-gh-actions`, // Current known branch
    `feature-branch-${prNumber}`,
    `hotfix-${prNumber}`, 
    `bugfix-${prNumber}`,
    `fix-branch-${prNumber}`,
    `dev-branch-${prNumber}`,
    cleanBranchName(`bug-fix-gh-actions-${prNumber}`),
    cleanBranchName(`feature-gh-actions-${prNumber}`),
    cleanBranchName(`fix-cors-issues-${prNumber}`),
  ];
};

/**
 * Test if an API URL is accessible
 * Returns true if the API responds with OK status
 */
export const testApiUrl = async (apiUrl: string, timeout: number = 3000): Promise<boolean> => {
  try {
    const testResponse = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout)
    });
    
    return testResponse.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Generate API URL patterns for a given branch name
 * Returns both .a.run.app and .us-central1.run.app patterns
 */
export const generateApiUrlPatterns = (cleanedBranch: string): string[] => {
  return [
    `https://api-github-${cleanedBranch}.a.run.app`,
    `https://api-github-${cleanedBranch}.us-central1.run.app`,
  ];
}; 