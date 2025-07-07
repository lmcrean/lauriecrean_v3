const { Octokit } = require('@octokit/rest');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate required environment variables
const requiredEnvVars = ['GITHUB_TOKEN', 'GEMINI_API_KEY', 'REPOSITORY_OWNER', 'REPOSITORY_NAME'];
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

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const REPOSITORY_OWNER = process.env.REPOSITORY_OWNER;
const REPOSITORY_NAME = process.env.REPOSITORY_NAME;

async function main() {
  try {
    console.log('Starting issue triage process...');
    
    // Step 1: Fetch all available labels
    const labels = await fetchRepositoryLabels();
    console.log(`Found ${labels.length} labels in repository`);
    
    // Step 2: Fetch issues without labels
    const unlabeledIssues = await fetchUnlabeledIssues();
    console.log(`Found ${unlabeledIssues.length} unlabeled issues`);
    
    // Step 3: Process each unlabeled issue
    for (const issue of unlabeledIssues) {
      await processIssue(issue, labels);
      // Add a small delay to avoid overwhelming the APIs
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('Issue triage completed successfully');
  } catch (error) {
    console.error('Error during issue triage:', error);
    process.exit(1);
  }
}

async function fetchRepositoryLabels() {
  try {
    const response = await octokit.rest.issues.listLabelsForRepo({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
    });
    
    return response.data.map(label => ({
      name: label.name,
      description: label.description,
      color: label.color
    }));
  } catch (error) {
    console.error('Error fetching repository labels:', error);
    throw error;
  }
}

async function fetchUnlabeledIssues() {
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
      state: 'open',
      per_page: 50
    });
    
    // Filter out pull requests and issues that already have labels
    const unlabeledIssues = response.data.filter(issue => 
      !issue.pull_request && (!issue.labels || issue.labels.length === 0)
    );
    
    return unlabeledIssues;
  } catch (error) {
    console.error('Error fetching unlabeled issues:', error);
    throw error;
  }
}

async function processIssue(issue, availableLabels) {
  try {
    console.log(`Processing issue #${issue.number}: "${issue.title}"`);
    
    // Use Gemini AI to analyze the issue and suggest labels
    const suggestedLabels = await analyzeIssueWithAI(issue, availableLabels);
    
    if (suggestedLabels.length > 0) {
      console.log(`Suggested labels for issue #${issue.number}: ${suggestedLabels.join(', ')}`);
      
      // Apply the suggested labels
      await applyLabelsToIssue(issue.number, suggestedLabels);
      console.log(`Applied labels to issue #${issue.number}`);
    } else {
      console.log(`No suitable labels found for issue #${issue.number}`);
    }
  } catch (error) {
    console.error(`Error processing issue #${issue.number}:`, error);
  }
}

async function analyzeIssueWithAI(issue, availableLabels) {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent results
          maxOutputTokens: 100, // Limit response length
        }
      });
      
      const labelNames = availableLabels.map(label => label.name);
      const labelDescriptions = availableLabels.map(label => 
        `${label.name}: ${label.description || 'No description'}`
      ).join('\n');
      
      const prompt = `
Analyze this GitHub issue and suggest appropriate labels from the available labels list.

Issue Title: "${issue.title}"
Issue Body: "${issue.body || 'No description provided'}"

Available labels:
${labelDescriptions}

Instructions:
1. Based on the issue content, suggest 1-3 most appropriate labels from the available list
2. Only suggest labels that exist in the available labels list
3. Consider the issue type (bug, feature, documentation, etc.)
4. Consider the technology/area mentioned in the issue
5. Return only the label names, separated by commas
6. If no suitable labels are found, return "none"

Response format: label1, label2, label3 (or "none")
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (text.toLowerCase() === 'none') {
        return [];
      }
      
      // Parse the response and validate against available labels
      const suggestedLabels = text.split(',').map(label => label.trim());
      const validLabels = suggestedLabels.filter(label => 
        labelNames.includes(label)
      );
      
      return validLabels;
    } catch (error) {
      retryCount++;
      console.error(`AI analysis attempt ${retryCount} failed for issue #${issue.number}:`, error.message);
      
      if (retryCount >= maxRetries) {
        console.error(`Max retries reached for issue #${issue.number}`);
        return [];
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
    }
  }
  
  return [];
}

async function applyLabelsToIssue(issueNumber, labels) {
  try {
    await octokit.rest.issues.addLabels({
      owner: REPOSITORY_OWNER,
      repo: REPOSITORY_NAME,
      issue_number: issueNumber,
      labels: labels
    });
  } catch (error) {
    console.error(`Error applying labels to issue #${issueNumber}:`, error);
    throw error;
  }
}

// Run the main function
main();