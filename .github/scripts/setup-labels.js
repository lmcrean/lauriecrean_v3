const { Octokit } = require('@octokit/rest');

// Validate required environment variables
const requiredEnvVars = ['GITHUB_TOKEN', 'REPOSITORY_OWNER', 'REPOSITORY_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please ensure all required environment variables are set.');
  process.exit(1);
}

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPOSITORY_OWNER = process.env.REPOSITORY_OWNER;
const REPOSITORY_NAME = process.env.REPOSITORY_NAME;

// Recommended labels for developer portfolio repositories
const recommendedLabels = [
  // Issue Types
  { name: 'bug', description: 'Something isn\'t working', color: 'd73a4a' },
  { name: 'feature', description: 'New feature or request', color: '0e8a16' },
  { name: 'enhancement', description: 'Improvement to existing functionality', color: 'a2eeef' },
  { name: 'documentation', description: 'Improvements or additions to documentation', color: '0075ca' },
  
  // Priority
  { name: 'priority: high', description: 'High priority issue', color: 'b60205' },
  { name: 'priority: medium', description: 'Medium priority issue', color: 'fbca04' },
  { name: 'priority: low', description: 'Low priority issue', color: '0e8a16' },
  
  // Technology/Area
  { name: 'frontend', description: 'Frontend/UI related issues', color: '1f77b4' },
  { name: 'backend', description: 'Backend/API related issues', color: 'ff7f0e' },
  { name: 'github-actions', description: 'GitHub Actions workflow issues', color: '2ca02c' },
  { name: 'deployment', description: 'Deployment and hosting issues', color: 'd62728' },
  { name: 'testing', description: 'Testing related issues', color: '9467bd' },
  { name: 'security', description: 'Security related issues', color: 'e377c2' },
  
  // Status
  { name: 'good first issue', description: 'Good for newcomers', color: '7057ff' },
  { name: 'help wanted', description: 'Extra attention is needed', color: '008672' },
  { name: 'wontfix', description: 'This will not be worked on', color: 'ffffff' },
  { name: 'duplicate', description: 'This issue or pull request already exists', color: 'cccccc' },
  
  // Portfolio Specific
  { name: 'portfolio', description: 'Issues related to portfolio display', color: 'ff9500' },
  { name: 'projects', description: 'Issues related to project showcase', color: 'ff6b6b' },
  { name: 'skills', description: 'Issues related to skills section', color: '4ecdc4' },
  { name: 'contact', description: 'Issues related to contact functionality', color: '45b7d1' },
  { name: 'responsive', description: 'Mobile/responsive design issues', color: 'f39c12' },
  { name: 'performance', description: 'Performance optimization issues', color: 'e74c3c' }
];

async function setupRepositoryLabels() {
  try {
    console.log('Setting up repository labels...');
    
    // Get existing labels
    const existingLabels = await getExistingLabels();
    const existingLabelNames = existingLabels.map(label => label.name);
    
    console.log(`Found ${existingLabels.length} existing labels`);
    
    // Create new labels
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const label of recommendedLabels) {
      if (existingLabelNames.includes(label.name)) {
        console.log(`Skipping existing label: ${label.name}`);
        skippedCount++;
      } else {
        try {
          await createLabel(label);
          console.log(`Created label: ${label.name}`);
          createdCount++;
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to create label ${label.name}:`, error.message);
        }
      }
    }
    
    console.log(`\nLabel setup complete:`);
    console.log(`- Created: ${createdCount} labels`);
    console.log(`- Skipped: ${skippedCount} labels (already exist)`);
    console.log(`- Total recommended: ${recommendedLabels.length} labels`);
    
  } catch (error) {
    console.error('Error setting up repository labels:', error);
    process.exit(1);
  }
}

async function getExistingLabels() {
  try {
    const response = await octokit.rest.issues.listLabelsForRepo({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching existing labels:', error);
    throw error;
  }
}

async function createLabel(label) {
  try {
    await octokit.rest.issues.createLabel({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
      name: label.name,
      description: label.description,
      color: label.color
    });
  } catch (error) {
    console.error(`Error creating label ${label.name}:`, error);
    throw error;
  }
}

// Run the setup if script is executed directly
if (require.main === module) {
  setupRepositoryLabels();
}

module.exports = {
  setupRepositoryLabels,
  recommendedLabels
};