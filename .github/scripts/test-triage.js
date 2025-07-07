#!/usr/bin/env node

// Test script for issue triage functionality
// This script can be used to test the issue triage logic locally

const { Octokit } = require('@octokit/rest');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock environment variables for testing
const testEnv = {
  GITHUB_TOKEN: 'test-token',
  GEMINI_API_KEY: 'test-key',  
  REPOSITORY_OWNER: 'test-owner',
  REPOSITORY_NAME: 'test-repo'
};

// Test data
const mockLabels = [
  { name: 'bug', description: 'Something isn\'t working', color: 'd73a4a' },
  { name: 'feature', description: 'New feature or request', color: 'a2eeef' },
  { name: 'documentation', description: 'Improvements or additions to documentation', color: '0075ca' },
  { name: 'good first issue', description: 'Good for newcomers', color: '7057ff' },
  { name: 'help wanted', description: 'Extra attention is needed', color: '008672' }
];

const mockIssue = {
  number: 123,
  title: 'Add user authentication to the application',
  body: 'We need to implement user authentication using OAuth 2.0. This should include login, logout, and session management.',
  labels: []
};

// Test functions
function testLabelAnalysis() {
  console.log('Testing label analysis logic...');
  
  // Test prompt generation
  const labelNames = mockLabels.map(label => label.name);
  const labelDescriptions = mockLabels.map(label => 
    `${label.name}: ${label.description || 'No description'}`
  ).join('\n');
  
  const prompt = `
Analyze this GitHub issue and suggest appropriate labels from the available labels list.

Issue Title: "${mockIssue.title}"
Issue Body: "${mockIssue.body || 'No description provided'}"

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

  console.log('Generated prompt:');
  console.log(prompt);
  console.log('\n--- Expected labels for this issue: feature ---\n');
}

function testResponseParsing() {
  console.log('Testing response parsing...');
  
  const testResponses = [
    'feature, documentation',
    'bug',
    'none',
    'feature, invalid-label, documentation',
    'bug, feature, help wanted'
  ];
  
  const labelNames = mockLabels.map(label => label.name);
  
  testResponses.forEach(response => {
    console.log(`Response: "${response}"`);
    
    if (response.toLowerCase() === 'none') {
      console.log('  Parsed labels: []');
    } else {
      const suggestedLabels = response.split(',').map(label => label.trim());
      const validLabels = suggestedLabels.filter(label => 
        labelNames.includes(label)
      );
      console.log(`  Parsed labels: [${validLabels.join(', ')}]`);
    }
    console.log('');
  });
}

function runTests() {
  console.log('=== Issue Triage Bot Test Suite ===\n');
  
  testLabelAnalysis();
  testResponseParsing();
  
  console.log('=== Test Suite Complete ===');
}

// Run tests if script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testLabelAnalysis,
  testResponseParsing,
  runTests
};