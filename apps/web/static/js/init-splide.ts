// Manual Splide initialization with retry logic and mutation observer
(function(): void {
  // Track if initialization has already occurred
  let hasInitialized: boolean = false;
  let retryCount: number = 0;
  const MAX_RETRIES: number = 10;
  
  // Type definitions for Splide
  interface SplideOptions {
    type?: string;
    perPage?: number;
    perMove?: number;
    gap?: string;
    pagination?: boolean;
    arrows?: boolean;
    autoplay?: boolean;
    interval?: number;
    pauseOnHover?: boolean;
    speed?: number;
    arrowPath?: string;
  }

  interface SplideInstance {
    index: number;
    Components: {
      Controller: {
        getEnd(): number;
      };
    };
    on(event: string, callback: () => void): void;
    mount(): void;
  }

  const Splide = (window as any).Splide as new (element: Element, options: SplideOptions) => SplideInstance;
  
  // Main initialization function
  function initSplide(): void {
    // Check if Splide is loaded
    if (typeof Splide === 'undefined') {
      
      // Load Splide CSS
      const splideCSS: HTMLLinkElement = document.createElement('link');
      splideCSS.rel = 'stylesheet';
      splideCSS.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
      document.head.appendChild(splideCSS);
      
      // Load Splide JS
      const splideScript: HTMLScriptElement = document.createElement('script');
      splideScript.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
      splideScript.onload = function(): void {
        setTimeout(initializeSplideCarousels, 100); // Wait a bit after script loads
      };
      document.body.appendChild(splideScript);
    } else {
      initializeSplideCarousels();
    }
  }
  
  function initializeSplideCarousels(): void {
    // Check if we have any uninitialized carousels
    const splideElements: NodeListOf<Element> = document.querySelectorAll('.splide:not(.is-initialized)');
    
    // If no uninitialized elements found, retry a few times
    if (splideElements.length === 0) {
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        setTimeout(initializeSplideCarousels, 1000); // Retry after 1 second
        return;
      }
      return;
    }
    
    hasInitialized = true;
    let successCount: number = 0;
    
    // Initialize all carousels with consistent settings
    splideElements.forEach(function(carousel: Element, index: number): void {
      try {
        // Don't reinitialize if a React component already handled it
        if (carousel.getAttribute('data-splide-initialized') === 'true') {
          return;
        }
        
        // Check if we already have a progress bar
        let progressBar = carousel.querySelector('.my-carousel-progress-bar') as HTMLElement;
        let progressBarContainer = carousel.querySelector('.my-carousel-progress') as HTMLElement;
        
        // Create progress bar if it doesn't exist
        if (!progressBar) {
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
        splide.on('mounted move', function(): void {
          try {
            const end = splide.Components.Controller.getEnd() + 1;
            const rate = Math.min((splide.index + 1) / end, 1);
            progressBar.style.width = String(100 * rate) + '%';
          } catch (e) {
            // Silent error handling for progress bar updates
          }
        });
        
        splide.mount();
        carousel.setAttribute('data-splide-initialized', 'true');
        successCount++;
      } catch (e) {
        // Silent error handling for carousel initialization
      }
    });
    
    // If we still have more carousels to initialize, retry
    if (successCount === 0 && retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(initializeSplideCarousels, 1000);
    }
  }

  // Set up mutation observer to detect when new content is added
  function setupMutationObserver(): void {
    const observer: MutationObserver = new MutationObserver(function(mutations: MutationRecord[]): void {
      let hasSplideElements: boolean = false;
      
      mutations.forEach(function(mutation: MutationRecord): void {
        if (mutation.addedNodes.length) {
          // Check if any of the added nodes are splide elements or contain them
          mutation.addedNodes.forEach(function(node: Node): void {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              if ((element.classList && element.classList.contains('splide') && !element.classList.contains('is-initialized')) ||
                  (element.querySelector && element.querySelector('.splide:not(.is-initialized)'))) {
                hasSplideElements = true;
              }
            }
          });
        }
      });
      
      if (hasSplideElements) {
        // Reset retry counter for new elements
        retryCount = 0;
        initializeSplideCarousels();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Add sidebar toggle listener to handle sidebar collapse/expand
  function setupSidebarToggleListener(): void {
    // Function to refresh all splide carousels without changing slides
    function refreshSplideCarousels(): void {
      
      // Find all initialized splides
      document.querySelectorAll('.splide.is-initialized').forEach(function(carousel: Element): void {
        try {
          // Dispatch a resize event to trigger Splide's internal resize handler
          if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 100);
          }
        } catch (e) {
          // Silent error handling for carousel refresh
        }
      });
    }
    
    // Use MutationObserver to detect sidebar toggle
    const sidebarObserver: MutationObserver = new MutationObserver(function(mutations: MutationRecord[]): void {
      mutations.forEach(function(mutation: MutationRecord): void {
        if (mutation.attributeName === 'class') {
          const sidebarCollapsed = document.documentElement.classList.contains('sidebar-hidden') || 
                                   document.documentElement.classList.contains('navbar--sidebar-show') || 
                                   document.documentElement.classList.contains('navbar-sidebar--show');
          
          // Wait for the sidebar animation to start before refreshing
          setTimeout(refreshSplideCarousels, 300);
        }
      });
    });
    
    // Start observing the HTML element for class changes
    sidebarObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Also listen for Docusaurus sidebar toggle button clicks directly
    document.addEventListener('click', function(event: Event): void {
      const target = event.target as Element;
      const toggleButton = target.closest('.navbar__toggle, .navbar-sidebar__close, .navbar-sidebar__backdrop, .navbar__toggle');
      if (toggleButton) {
        // Wait a bit for the sidebar animation to start
        setTimeout(refreshSplideCarousels, 300);
      }
    });
  }

  // Initialize on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(): void {
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
  document.addEventListener('docusaurus.routeDidUpdate', function(): void {
    // Reset initialization flag when route changes
    hasInitialized = false;
    retryCount = 0;
    setTimeout(initializeSplideCarousels, 300); // Small delay to ensure DOM is updated
  });
})(); 