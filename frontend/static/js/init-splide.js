// Manual Splide initialization with retry logic and mutation observer
(function() {
  // Track if initialization has already occurred
  let hasInitialized = false;
  let retryCount = 0;
  const MAX_RETRIES = 10;
  
  // Main initialization function
  function initSplide() {
    // Check if Splide is loaded
    if (typeof Splide === 'undefined') {
      
      // Load Splide CSS
      const splideCSS = document.createElement('link');
      splideCSS.rel = 'stylesheet';
      splideCSS.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
      document.head.appendChild(splideCSS);
      
      // Load Splide JS
      const splideScript = document.createElement('script');
      splideScript.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
      splideScript.onload = function() {
        setTimeout(initializeSplideCarousels, 100); // Wait a bit after script loads
      };
      document.body.appendChild(splideScript);
    } else {
      initializeSplideCarousels();
    }
  }
  
  function initializeSplideCarousels() {
    console.log('[init-splide.js] Manual Splide initialization running');
    
    // Check if we have any uninitialized carousels
    const splideElements = document.querySelectorAll('.splide:not(.is-initialized)');
    console.log(`[init-splide.js] Found ${splideElements.length} uninitialized splide elements`);
    
    // Log all splide elements for debugging
    const allSplideElements = document.querySelectorAll('.splide');
    console.log(`[init-splide.js] Total splide elements found: ${allSplideElements.length}`);
    
    // Log details of each element for debugging
    if (allSplideElements.length > 0) {
      allSplideElements.forEach((el, index) => {
        console.log(`[init-splide.js] Splide element #${index}:`, el.id, el.className);
      });
    }
    
    // If no uninitialized elements found, retry a few times
    if (splideElements.length === 0) {
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        console.log(`[init-splide.js] No splide elements found, will retry after a delay (${retryCount}/${MAX_RETRIES})`);
        setTimeout(initializeSplideCarousels, 1000); // Retry after 1 second
        return;
      }
      console.log('[init-splide.js] Max retries reached. No splide elements found.');
      return;
    }
    
    hasInitialized = true;
    let successCount = 0;
    
    // Initialize all carousels with consistent settings
    splideElements.forEach(function(carousel, index) {
      try {
        console.log(`[init-splide.js] Initializing carousel #${index} with ID: ${carousel.id}`);
        
        // Don't reinitialize if a React component already handled it
        if (carousel.getAttribute('data-splide-initialized') === 'true') {
          console.log(`[init-splide.js] Carousel ${carousel.id} already initialized by React component, skipping`);
          return;
        }
        
        // Check if we already have a progress bar
        let progressBar = carousel.querySelector('.my-carousel-progress-bar');
        let progressBarContainer = carousel.querySelector('.my-carousel-progress');
        
        // Create progress bar if it doesn't exist
        if (!progressBar) {
          console.log(`[init-splide.js] Adding progress bar to ${carousel.id}`);
          progressBarContainer = document.createElement('div');
          progressBarContainer.className = 'my-carousel-progress';
          progressBar = document.createElement('div');
          progressBar.className = 'my-carousel-progress-bar';
          progressBarContainer.appendChild(progressBar);
          carousel.appendChild(progressBarContainer);
        }
        
        const splide = new Splide(carousel, {
          type: 'loop',
          perPage: 1,
          perMove: 1,
          gap: '1rem',
          pagination: false, // Using custom progress bar
          arrows: true,
          autoplay: false,
          arrowPath: 'm 15.5 0.932 l -4.3 4.38 l 14.5 14.6 l -14.5 14.5 l 4.3 4.4 l 14.6 -14.6 l 4.4 -4.3 l -4.4 -4.4 l -14.6 -14.6 Z',
          speed: 400,
        });
        
        // Update the progress bar when the carousel moves
        splide.on('mounted move', function() {
          try {
            const end = splide.Components.Controller.getEnd() + 1;
            const rate = Math.min((splide.index + 1) / end, 1);
            progressBar.style.width = String(100 * rate) + '%';
          } catch (e) {
            console.error(`[init-splide.js] Error updating progress bar for ${carousel.id}:`, e);
          }
        });
        
        splide.mount();
        carousel.setAttribute('data-splide-initialized', 'true');
        console.log(`[init-splide.js] Carousel ${carousel.id} initialized successfully`);
        successCount++;
      } catch (e) {
        console.error(`[init-splide.js] Error initializing carousel ${carousel.id}:`, e);
      }
    });
    
    // If we still have more carousels to initialize, retry
    if (successCount === 0 && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`[init-splide.js] No carousels were initialized. Retrying (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(initializeSplideCarousels, 1000);
    } else if (successCount > 0) {
      console.log(`[init-splide.js] Successfully initialized ${successCount} carousels`);
    }
  }

  // Set up mutation observer to detect when new content is added
  function setupMutationObserver() {
    console.log('[init-splide.js] Setting up mutation observer for dynamic content');
    const observer = new MutationObserver(function(mutations) {
      let hasSplideElements = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Check if any of the added nodes are splide elements or contain them
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              if ((node.classList && node.classList.contains('splide') && !node.classList.contains('is-initialized')) ||
                  (node.querySelector && node.querySelector('.splide:not(.is-initialized)'))) {
                hasSplideElements = true;
              }
            }
          });
        }
      });
      
      if (hasSplideElements) {
        console.log('[init-splide.js] New splide elements detected in DOM, initializing them');
        // Reset retry counter for new elements
        retryCount = 0;
        initializeSplideCarousels();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Add sidebar toggle listener to handle sidebar collapse/expand
  function setupSidebarToggleListener() {
    console.log('[init-splide.js] Setting up sidebar toggle listener');
    
    // Function to refresh all splide carousels without changing slides
    function refreshSplideCarousels() {
      console.log('[init-splide.js] Sidebar toggled, refreshing Splide carousels');
      
      // Find all initialized splides
      document.querySelectorAll('.splide.is-initialized').forEach(function(carousel) {
        try {
          console.log(`[init-splide.js] Refreshing carousel layout for ${carousel.id}`);
          
          // Dispatch a resize event to trigger Splide's internal resize handler
          if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 100);
          }
        } catch (e) {
          console.error(`[init-splide.js] Error refreshing carousel ${carousel.id}:`, e);
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
          
          console.log('[init-splide.js] Sidebar state changed, collapsed:', sidebarCollapsed);
          // Wait for the sidebar animation to start before refreshing
          setTimeout(refreshSplideCarousels, 300);
        }
      });
    });
    
    // Start observing the HTML element for class changes
    sidebarObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Also listen for Docusaurus sidebar toggle button clicks directly
    document.addEventListener('click', function(event) {
      const toggleButton = event.target.closest('.navbar__toggle, .navbar-sidebar__close, .navbar-sidebar__backdrop, .navbar__toggle');
      if (toggleButton) {
        console.log('[init-splide.js] Sidebar toggle button clicked');
        // Wait a bit for the sidebar animation to start
        setTimeout(refreshSplideCarousels, 300);
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
    console.log('[init-splide.js] Route updated, reinitializing Splide carousels');
    // Reset initialization flag when route changes
    hasInitialized = false;
    retryCount = 0;
    setTimeout(initializeSplideCarousels, 300); // Small delay to ensure DOM is updated
  });
})(); 