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

            /* Banner and intro styles */
            .banner-section {
                width: 100%;
                margin-bottom: 2rem;
                text-align: center;
            }

            .banner-section img {
                max-width: 100%;
                height: auto;
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

        // Get all h2 elements and their positions
        const h2Elements = Array.from(mainContent.querySelectorAll('h2'));
        if (h2Elements.length === 0) return;

        // Store the content that appears before the first H2
        const bannerSection = document.createElement('div');
        bannerSection.className = 'banner-section';
        let currentElement = mainContent.firstChild;
        const firstH2 = h2Elements[0];

        while (currentElement && currentElement !== firstH2) {
            const nextElement = currentElement.nextSibling;
            bannerSection.appendChild(currentElement);
            currentElement = nextElement;
        }

        // Store original positions of all elements for reference
        const originalPositions = new Map();
        h2Elements.forEach((h2, index) => {
            originalPositions.set(h2, index);
        });

        // Create a container for non-splide projects
        let projectsContainer = document.createElement('div');
        projectsContainer.className = 'projects-grid';

        // First pass: collect and organize content
        const sections = h2Elements.map(h2 => {
            let sectionContent = [];
            let currentElement = h2.nextElementSibling;
            let hasSplide = false;
            
            while (currentElement && currentElement.tagName !== 'H2') {
                if (currentElement.querySelector('.splide')) {
                    hasSplide = true;
                }
                sectionContent.push(currentElement);
                currentElement = currentElement.nextElementSibling;
            }

            return {
                h2,
                content: sectionContent,
                hasSplide,
                originalIndex: originalPositions.get(h2)
            };
        });

        // Clear main content
        while (mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild);
        }

        // Add the banner section back first
        if (bannerSection.hasChildNodes()) {
            mainContent.appendChild(bannerSection);
        }

        // Second pass: reconstruct content in correct order
        sections.forEach((section, index) => {
            if (section.hasSplide) {
                // Insert accumulated projects before splide if any exist
                if (projectsContainer.children.length > 0) {
                    mainContent.appendChild(projectsContainer);
                    projectsContainer = document.createElement('div');
                    projectsContainer.className = 'projects-grid';
                }

                // Create splide wrapper
                const splideWrapper = document.createElement('div');
                splideWrapper.className = 'splide-wrapper';
                splideWrapper.appendChild(section.h2);
                section.content.forEach(el => splideWrapper.appendChild(el));
                mainContent.appendChild(splideWrapper);
            } else {
                // Add to projects grid
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.appendChild(section.h2);
                section.content.forEach(el => projectItem.appendChild(el));
                projectsContainer.appendChild(projectItem);
            }
        });

        // Append any remaining projects
        if (projectsContainer.children.length > 0) {
            mainContent.appendChild(projectsContainer);
        }
    }
}

// Initialize the layout manager
new SectionLayout(); 