// Handles the column layout management for projects
class ProjectColumns {
    constructor() {
        this.addColumnStyles();
    }

    addColumnStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .project-container {
                display: block;
                width: 100%;
                margin: 2rem 0;
            }
            
            .project-section {
                margin-bottom: 2rem;
            }
            
            @media (min-width: 1400px) {
                .project-container:not(.full-stack-container) {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }
                
                .project-section {
                    grid-column: span 1;
                    margin-bottom: 0;
                }
                
                .project-section.two-columns-lg {
                    grid-column: span 2;
                }

                /* Full stack projects always take full width */
                .full-stack-container .project-section {
                    grid-column: span 1;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    wrapInColumns(sections, isFullStack = false) {
        const container = document.createElement('div');
        container.className = `project-container${isFullStack ? ' full-stack-container' : ''}`;

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'project-section';
            
            // Only apply two-columns logic if not a full stack project
            if (!isFullStack) {
                const h2 = section.querySelector('h2');
                if (h2 && (h2.dataset.columns === '2' || h2.classList.contains('two-columns-lg'))) {
                    sectionDiv.classList.add('two-columns-lg');
                }
            }

            // Move all content into the section div
            Array.from(section.children).forEach(child => {
                sectionDiv.appendChild(child.cloneNode(true));
            });

            container.appendChild(sectionDiv);
        });

        return container;
    }
}

export default ProjectColumns; 