// Function to get h2 headings between h1 sections
function getProjectHeadings() {
    // Wait for Docsify to load content
    const mainContent = document.querySelector('#main');
    if (!mainContent) {
        console.log('Main content not found, waiting for Docsify...');
        return;
    }

    let frontEndSection = false;
    let backEndSection = false;
    const frontEndProjects = [];
    const backEndProjects = [];
    
    // Use all h1 and h2 elements in the main content
    const headings = mainContent.querySelectorAll('h1, h2');
    
    headings.forEach(heading => {
        if (heading.tagName === 'H1') {
            const sectionTitle = heading.textContent.trim().toLowerCase();
            frontEndSection = sectionTitle === 'front end projects';
            backEndSection = sectionTitle === 'back end projects';
            console.log('Found section:', sectionTitle); // Debug log
        } else if (heading.tagName === 'H2') {
            const projectTitle = heading.textContent.trim();
            if (frontEndSection) {
                frontEndProjects.push(projectTitle);
                console.log('Added to Front End:', projectTitle); // Debug log
            } else if (backEndSection) {
                backEndProjects.push(projectTitle);
                console.log('Added to Back End:', projectTitle); // Debug log
            }
        }
    });
    
    // Log results to console
    console.log('Front End Projects:', frontEndProjects);
    console.log('Back End Projects:', backEndProjects);
    
    return {
        frontEnd: frontEndProjects,
        backEnd: backEndProjects
    };
}

// Hook into Docsify's ready event
window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(
    function(hook, vm) {
        hook.doneEach(function() {
            // Run after each page load
            setTimeout(getProjectHeadings, 100); // Small delay to ensure content is loaded
        });
    }
);

