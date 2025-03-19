// Manual Splide initialization with retry logic and mutation observer
(function() {
  // Track if initialization has already occurred
  let hasInitialized = false;
  
  // Main initialization function
  function initSplide() {
    console.log('DOM fully loaded - init-splide.js executing');
    
    // Check if Splide is loaded
    if (typeof Splide === 'undefined') {
      console.error('Splide not loaded. Loading now...');
      
      // Load Splide CSS
      const splideCSS = document.createElement('link');
      splideCSS.rel = 'stylesheet';
      splideCSS.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
      document.head.appendChild(splideCSS);
      
      // Load Splide JS
      const splideScript = document.createElement('script');
      splideScript.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
      splideScript.onload = function() {
        console.log('Splide JS loaded successfully');
        setTimeout(initializeSplideCarousels, 500); // Wait a bit after script loads
      };
      document.body.appendChild(splideScript);
    } else {
      console.log('Splide already loaded');
      initializeSplideCarousels();
    }
  }
  
  function initializeSplideCarousels() {
    console.log('Manual Splide initialization running');
    
    // Check if we have any uninitialized carousels
    const splideElements = document.querySelectorAll('.splide:not(.is-initialized)');
    console.log(`Found ${splideElements.length} uninitialized splide elements with selector .splide:not(.is-initialized)`);
    
    // Log all splide elements for debugging
    const allSplideElements = document.querySelectorAll('.splide');
    console.log(`Total splide elements found: ${allSplideElements.length}`);
    allSplideElements.forEach((el, index) => {
      console.log(`Splide element #${index}:`, el.id, el.className);
    });
    
    if (splideElements.length === 0) {
      if (!hasInitialized) {
        console.log('No splide elements found, will retry after a delay');
        setTimeout(initializeSplideCarousels, 1000); // Retry after 1 second
        return;
      }
      console.log('No uninitialized splide elements found, skipping initialization');
      return;
    }
    
    hasInitialized = true;
    
    // Initialize all carousels with consistent settings
    // No special carousels - all use the same settings with linear progress bars and arrows
    document.querySelectorAll('.splide:not(.is-initialized)').forEach(function(carousel, index) {
      console.log(`Initializing carousel #${index} with ID: ${carousel.id}`);
      try {
        const splide = new Splide(carousel, {
          type: 'loop',
          perPage: 1,
          perMove: 1,
          gap: '1rem',
          pagination: false, // We're using our custom progress bar instead
          arrows: true,
          autoplay: false,
          arrowPath: 'm 15.5 0.932 l -4.3 4.38 l 14.5 14.6 l -14.5 14.5 l 4.3 4.4 l 14.6 -14.6 l 4.4 -4.3 l -4.4 -4.4 l -14.6 -14.6 Z',
          speed: 400,
        });
        
        // Get the progress bar - all carousels should have this
        const bar = carousel.querySelector('.my-carousel-progress-bar');
        if (bar) {
          // Update the progress bar when the carousel moves
          splide.on('mounted move', function() {
            const end = splide.Components.Controller.getEnd() + 1;
            const rate = Math.min((splide.index + 1) / end, 1);
            bar.style.width = String(100 * rate) + '%';
          });
        } else {
          console.warn(`Progress bar not found for ${carousel.id}`);
        }
        
        splide.mount();
        console.log(`Carousel ${carousel.id} initialized successfully`);
      } catch (e) {
        console.error(`Error initializing carousel ${carousel.id}:`, e);
      }
    });
  }

  // Set up mutation observer to detect when new content is added
  function setupMutationObserver() {
    console.log('Setting up mutation observer for dynamic content');
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Check if any of the added nodes are splide elements or contain them
          let hasSplideElements = false;
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              if (node.classList && node.classList.contains('splide') ||
                  node.querySelector && node.querySelector('.splide')) {
                hasSplideElements = true;
              }
            }
          });
          
          if (hasSplideElements) {
            console.log('New splide elements detected in DOM, initializing them');
            initializeSplideCarousels();
          }
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Add sidebar toggle listener to handle sidebar collapse/expand
  function setupSidebarToggleListener() {
    console.log('Setting up sidebar toggle listener');
    
    // Function to refresh all splide carousels without changing slides
    function refreshSplideCarousels() {
      console.log('Sidebar toggled, refreshing Splide carousels');
      
      // Find all initialized splides
      document.querySelectorAll('.splide.is-initialized').forEach(function(carousel) {
        try {
          console.log(`Refreshing carousel layout for ${carousel.id}`);
          
          // Force a reflow of the carousel by temporarily changing a CSS property
          // This is a gentler approach than clicking arrows
          const track = carousel.querySelector('.splide__track');
          if (track) {
            // Save current transform
            const originalTransform = track.style.transform;
            
            // Apply a small padding change to force layout recalculation
            const list = carousel.querySelector('.splide__list');
            if (list) {
              // Force a layout recalculation
              const originalWidth = list.offsetWidth;
              
              // Apply and remove a class to trigger reflow without changing slides
              carousel.classList.add('sidebar-toggle-refresh');
              setTimeout(() => {
                carousel.classList.remove('sidebar-toggle-refresh');
                
                // If we have Splide v4+, we can also try to dispatch a resize event
                if (typeof Splide !== 'undefined' && typeof Splide.prototype.emit === 'function') {
                  try {
                    // For newer Splide versions with emit method
                    const splideInstance = carousel.splide;
                    if (splideInstance && typeof splideInstance.emit === 'function') {
                      splideInstance.emit('resize');
                    }
                  } catch (e) {
                    console.log('Could not emit resize event, continuing with DOM-based refresh');
                  }
                }
                
                // Dispatch a window resize event as a last resort
                window.dispatchEvent(new Event('resize'));
              }, 10);
            }
          }
        } catch (e) {
          console.error(`Error refreshing carousel ${carousel.id}:`, e);
        }
      });
    }
    
    // Use MutationObserver to detect sidebar toggle
    const sidebarObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          const sidebarCollapsed = document.documentElement.classList.contains('sidebar-hidden') || 
                                   document.documentElement.classList.contains('navbar--sidebar-show') || 
                                   document.documentElement.classList.contains('navbar-sidebar--show');
          
          console.log('Sidebar state changed, collapsed:', sidebarCollapsed);
          // Wait for the sidebar animation to start before refreshing
          setTimeout(refreshSplideCarousels, 50);
        }
      });
    });
    
    // Start observing the HTML element for class changes
    sidebarObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Also listen for Docusaurus sidebar toggle button clicks directly
    document.addEventListener('click', function(event) {
      const toggleButton = event.target.closest('.navbar__toggle, .navbar-sidebar__close, .navbar-sidebar__backdrop, .navbar__toggle');
      if (toggleButton) {
        console.log('Sidebar toggle button clicked');
        // Wait a bit for the sidebar animation to start
        setTimeout(refreshSplideCarousels, 50);
      }
    });
  }

  // Initialize on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSplide();
      setupMutationObserver();
      setupSidebarToggleListener();
    });
  } else {
    initSplide();
    setupMutationObserver();
    setupSidebarToggleListener();
  }

  // Handle Docusaurus page transitions - initialize carousels after page changes
  // This is needed because Docusaurus uses client-side routing
  document.addEventListener('docusaurus.routeDidUpdate', function() {
    console.log('Route updated, reinitializing Splide carousels');
    // Reset initialization flag when route changes
    hasInitialized = false;
    setTimeout(initializeSplideCarousels, 500); // Small delay to ensure DOM is updated
  });
})(); 