/**
 * Simple script to verify button styling in the build files
 */

const fs = require('fs');
const path = require('path');

// Path to the projects HTML file
const projectsHtmlPath = path.resolve(__dirname, '../../build/projects/index.html');
console.log('Projects HTML path:', projectsHtmlPath);

// Check if the projects HTML file exists
if (!fs.existsSync(projectsHtmlPath)) {
  console.error('Projects HTML file not found at path:', projectsHtmlPath);
  process.exit(1);
}

// Read the projects HTML file
const htmlContent = fs.readFileSync(projectsHtmlPath, 'utf8');
console.log('HTML content length:', htmlContent.length);

// Check for button classes
const codeButtonMatches = htmlContent.match(/class="code-btn/g);
const readmeButtonMatches = htmlContent.match(/class="readme-btn/g);
const liveDemoButtonMatches = htmlContent.match(/class="live-demo-btn/g);

console.log('Number of code buttons found:', codeButtonMatches ? codeButtonMatches.length : 0);
console.log('Number of readme buttons found:', readmeButtonMatches ? readmeButtonMatches.length : 0);
console.log('Number of live demo buttons found:', liveDemoButtonMatches ? liveDemoButtonMatches.length : 0);

// Check for button icons
const codeIconMatches = htmlContent.match(/class="fa fa-code/g);
const bookIconMatches = htmlContent.match(/class="fa fa-book/g);
const playIconMatches = htmlContent.match(/class="fa fa-play/g);

console.log('Number of code icons found:', codeIconMatches ? codeIconMatches.length : 0);
console.log('Number of book icons found:', bookIconMatches ? bookIconMatches.length : 0);
console.log('Number of play icons found:', playIconMatches ? playIconMatches.length : 0);

// Check for CSS class definitions
const cssDefinitions = htmlContent.match(/\.code-btn|\.readme-btn|\.live-demo-btn/g);
console.log('Number of button CSS class definitions found:', cssDefinitions ? cssDefinitions.length : 0);

console.log('Verification complete!');

if (codeButtonMatches && readmeButtonMatches && liveDemoButtonMatches) {
  console.log('SUCCESS: Button classes found in the HTML!');
} else {
  console.error('ERROR: One or more button classes not found in the HTML.');
}

if (codeIconMatches && bookIconMatches && playIconMatches) {
  console.log('SUCCESS: Button icons found in the HTML!');
} else {
  console.error('ERROR: One or more button icons not found in the HTML.');
}

if (cssDefinitions) {
  console.log('SUCCESS: Button CSS definitions found in the HTML!');
} else {
  console.error('ERROR: Button CSS definitions not found in the HTML.');
} 