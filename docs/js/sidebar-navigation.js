function initializeSidebarNavigation() {
    // Add click event to first-level sidebar items (excluding buttons)
    document.querySelectorAll('.sidebar-nav > ul > li:not(:has(> .sidebar-button))').forEach((item) => {
        if (item.querySelector('ul')) {  // Only add click event if the item has children
            item.addEventListener('click', function(e) {
                if (e.target.tagName.toLowerCase() === 'a') return;
                e.preventDefault();
                this.classList.toggle('collapse');
                this.classList.toggle('open');
            });
        }
    });

    // Expand current page in sidebar
    let activeLink = document.querySelector('.sidebar-nav li.active');
    if (activeLink) {
        let parent = activeLink.parentElement;
        while (parent && !parent.classList.contains('sidebar-nav')) {
            if (parent.tagName.toLowerCase() === 'li') {
                parent.classList.remove('collapse');
                parent.classList.add('open');
            }
            parent = parent.parentElement;
        }
    }
}

// Initialize sidebar navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSidebarNavigation);

export { initializeSidebarNavigation }; 