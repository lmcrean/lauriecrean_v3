class SectionLayout {
    constructor() {
        this.initStyles();
        this.initDocsifyHook();
    }

    initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .projects-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                margin: 2rem 0;
            }
            
            .project-item {
                width: 100%;
            }

            /* Ensure splide sections take full width */
            .splide-wrapper {
                grid-column: 1 / -1;
                width: 100%;
            }

            /* Desktop layout - only apply 2 columns above 1400px */
            @media (min-width: 1400px) {
                .projects-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }

    initDocsifyHook() {
        window.$docsify = window.$docsify || {};
        window.$docsify.plugins = (window.$docsify.plugins || []).concat(
            (hook) => {
                hook.doneEach(() => {
                    setTimeout(() => {
                        this.processContent();
                    }, 100);
                });
            }
        );
    }

    processContent() {
        const mainContent = document.querySelector('#main');
        if (!mainContent) return;

        const h2Elements = Array.from(mainContent.querySelectorAll('h2'));
        
        // Create a container for all projects
        const projectsContainer = document.createElement('div');
        projectsContainer.className = 'projects-grid';
        
        h2Elements.forEach(h2 => {
            let sectionContent = [];
            let currentElement = h2.nextElementSibling;
            let hasSplide = false;
            
            // Collect elements until next h2 or no more siblings
            while (currentElement && currentElement.tagName !== 'H2') {
                if (currentElement.querySelector('.splide')) {
                    hasSplide = true;
                }
                sectionContent.push(currentElement);
                currentElement = currentElement.nextElementSibling;
            }

            if (sectionContent.length > 0) {
                // If this section has a splide carousel
                if (hasSplide) {
                    const splideWrapper = document.createElement('div');
                    splideWrapper.className = 'splide-wrapper';
                    
                    // Move the h2 and content instead of cloning
                    splideWrapper.appendChild(h2);
                    sectionContent.forEach(el => splideWrapper.appendChild(el));
                    
                    // If we have a projects container with content, insert it before the splide section
                    if (projectsContainer.children.length > 0) {
                        mainContent.appendChild(projectsContainer.cloneNode(true));
                        projectsContainer.innerHTML = ''; // Clear for future projects
                    }
                    
                    // Insert the splide wrapper
                    mainContent.appendChild(splideWrapper);
                } else {
                    // Create a project item
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    
                    // Move the h2 and content instead of cloning
                    projectItem.appendChild(h2);
                    sectionContent.forEach(el => projectItem.appendChild(el));
                    
                    // Add to projects container
                    projectsContainer.appendChild(projectItem);
                }
            }
        });
        
        // If we have any remaining projects in the container, insert it
        if (projectsContainer.children.length > 0) {
            mainContent.appendChild(projectsContainer);
        }
    }
}

// Initialize the layout manager
new SectionLayout(); 