import ProjectColumns from './projectColumns.js';

class SectionManager {
    constructor() {
        this.projectColumns = new ProjectColumns();
        this.initDocsifyHook();
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
        if (!mainContent) {
            console.log('Main content not found, waiting for Docsify...');
            return;
        }

        const currentPath = window.location.hash.slice(2) || 'README';
        const sections = this.extractSections(mainContent, currentPath);
        
        if (sections.length > 0) {
            sections.forEach(({ sections: sectionGroup, isFullStack }) => {
                if (sectionGroup.length > 0) {
                    const columnsContainer = this.projectColumns.wrapInColumns(sectionGroup, isFullStack);
                    // Replace the original content with our new organized sections
                    sectionGroup[0][0].parentNode.insertBefore(columnsContainer, sectionGroup[0][0]);
                    sectionGroup.forEach(section => {
                        section.forEach(element => element.remove());
                    });
                }
            });
        }
    }

    extractSections(mainContent, currentPath) {
        const sections = [];
        let currentSection = [];
        let isProcessingContent = false;
        let currentSectionType = null;

        // Get all h1 and h2 elements
        const allHeadings = mainContent.querySelectorAll('h1, h2');
        
        allHeadings.forEach((heading) => {
            if (heading.tagName === 'H1') {
                // Process any existing section before starting new one
                if (currentSection.length > 0) {
                    if (!sections.find(s => s.type === currentSectionType)) {
                        sections.push({
                            type: currentSectionType,
                            isFullStack: currentSectionType === 'full stack projects',
                            sections: [currentSection]
                        });
                    } else {
                        const existingSection = sections.find(s => s.type === currentSectionType);
                        existingSection.sections.push(currentSection);
                    }
                    currentSection = [];
                }

                // For README, only process content under specific sections
                if (currentPath === 'README') {
                    const title = heading.textContent.trim().toLowerCase();
                    isProcessingContent = ['front end projects', 'back end projects', 'full stack projects'].includes(title);
                    if (isProcessingContent) {
                        currentSectionType = title;
                    }
                } else if (['certifications', 'education', 'experience'].includes(currentPath)) {
                    isProcessingContent = true;
                    currentSectionType = currentPath;
                }
            } else if (heading.tagName === 'H2' && isProcessingContent) {
                if (currentSection.length > 0) {
                    if (!sections.find(s => s.type === currentSectionType)) {
                        sections.push({
                            type: currentSectionType,
                            isFullStack: currentSectionType === 'full stack projects',
                            sections: [currentSection]
                        });
                    } else {
                        const existingSection = sections.find(s => s.type === currentSectionType);
                        existingSection.sections.push(currentSection);
                    }
                }
                currentSection = [heading];
                
                // Collect all elements until the next h1 or h2
                let currentElement = heading;
                while (currentElement.nextElementSibling && 
                       currentElement.nextElementSibling.tagName !== 'H1' && 
                       currentElement.nextElementSibling.tagName !== 'H2') {
                    currentElement = currentElement.nextElementSibling;
                    currentSection.push(currentElement);
                }
            }
        });

        // Add the last section if it exists
        if (currentSection.length > 0 && currentSectionType) {
            if (!sections.find(s => s.type === currentSectionType)) {
                sections.push({
                    type: currentSectionType,
                    isFullStack: currentSectionType === 'full stack projects',
                    sections: [currentSection]
                });
            } else {
                const existingSection = sections.find(s => s.type === currentSectionType);
                existingSection.sections.push(currentSection);
            }
        }

        return sections;
    }
}

// Initialize the section manager
new SectionManager(); 