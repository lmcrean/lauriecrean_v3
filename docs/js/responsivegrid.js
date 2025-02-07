// Function to wrap content between h2s in grid sections
function wrapH2Sections() {
    const mainContent = document.querySelector('#main');
    if (!mainContent) {
        console.log('Main content not found, waiting for Docsify...');
        return;
    }

    // Get the current page path from Docsify
    const currentPath = window.location.hash.slice(2) || 'README';

    // Find all h1 and h2 elements
    const allHeadings = mainContent.querySelectorAll('h1, h2');
    if (allHeadings.length === 0) return;

    // Different handling based on the current page
    if (currentPath === 'README') {
        // Original portfolio project handling
        let inFrontEndSection = false;
        let inBackEndSection = false;
        const sections = [];
        let currentSection = [];

        // First pass: identify sections and their content
        allHeadings.forEach((heading) => {
            if (heading.tagName === 'H1') {
                const title = heading.textContent.trim().toLowerCase();
                inFrontEndSection = title === 'front end projects';
                inBackEndSection = title === 'back end projects';
            } else if (heading.tagName === 'H2' && (inFrontEndSection || inBackEndSection)) {
                if (currentSection.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = [heading];
                
                let currentElement = heading;
                while (currentElement.nextElementSibling && 
                       currentElement.nextElementSibling.tagName !== 'H1' && 
                       currentElement.nextElementSibling.tagName !== 'H2') {
                    currentElement = currentElement.nextElementSibling;
                    currentSection.push(currentElement);
                }
            }
        });

        if (currentSection.length > 0) {
            sections.push(currentSection);
        }

        wrapSectionsInGrid(sections);
    } else if (['certifications', 'education', 'experience'].includes(currentPath)) {
        // Handle certifications, education, and experience pages
        const sections = [];
        let currentSection = [];
        let isAfterFirstH1 = false;

        allHeadings.forEach((heading) => {
            if (heading.tagName === 'H1') {
                isAfterFirstH1 = true;
            } else if (heading.tagName === 'H2' && isAfterFirstH1) {
                if (currentSection.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = [heading];
                
                let currentElement = heading;
                while (currentElement.nextElementSibling && 
                       currentElement.nextElementSibling.tagName !== 'H1' && 
                       currentElement.nextElementSibling.tagName !== 'H2') {
                    currentElement = currentElement.nextElementSibling;
                    currentSection.push(currentElement);
                }
            }
        });

        if (currentSection.length > 0) {
            sections.push(currentSection);
        }

        wrapSectionsInGrid(sections);
    }
}

// Helper function to wrap sections in grid
function wrapSectionsInGrid(sections) {
    for (let i = 0; i < sections.length; i += 2) {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'project-grid-container';
        
        // Create first column
        const col1 = document.createElement('div');
        col1.className = 'project-grid-item';
        sections[i].forEach(element => {
            const clone = element.cloneNode(true);
            col1.appendChild(clone);
        });
        gridContainer.appendChild(col1);
        
        // If there's a second section in this pair, create second column
        if (i + 1 < sections.length) {
            const col2 = document.createElement('div');
            col2.className = 'project-grid-item';
            sections[i + 1].forEach(element => {
                const clone = element.cloneNode(true);
                col2.appendChild(clone);
            });
            gridContainer.appendChild(col2);
        }
        
        // Insert the grid container before the first element of the first section
        sections[i][0].parentNode.insertBefore(gridContainer, sections[i][0]);
        
        // Remove the original elements
        sections[i].forEach(element => element.remove());
        if (i + 1 < sections.length) {
            sections[i + 1].forEach(element => element.remove());
        }
    }
}

// Add the CSS for the grid layout
function addGridStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .project-grid-container {
            display: block;
            width: 100%;
            margin: 2rem 0;
        }
        
        @media (min-width: 1400px) {
            .project-grid-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
        }
        
        .project-grid-item {
            margin-bottom: 2rem;
        }
        
        @media (min-width: 1400px) {
            .project-grid-item {
                margin-bottom: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Hook into Docsify's ready event
window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(
    function(hook, vm) {
        hook.doneEach(function() {
            // Add the grid styles once
            addGridStyles();
            // Run after each page load
            setTimeout(() => {
                wrapH2Sections();
            }, 100); // Small delay to ensure content is loaded
        });
    }
);

