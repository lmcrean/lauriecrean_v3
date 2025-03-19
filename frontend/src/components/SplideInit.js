import React, { useEffect } from 'react';

// This is a client-side only component
export default function SplideInit({ testMode = false, onInitializeStart = null }) {
  useEffect(() => {
    console.log('SplideInit component mounted');

    // Check if we're running in a browser environment
    if (typeof window === 'undefined') {
      console.log('Not in browser environment, skipping Splide initialization');
      return;
    }

    // Check if carousels are already initialized by our static script
    const alreadyInitialized = document.querySelectorAll('.splide.is-initialized').length > 0;
    if (alreadyInitialized && !testMode) {
      console.log('Carousels already initialized by static script, skipping React initialization');
      return;
    }

    // Retry counter to avoid infinite retries
    let retryCount = 0;
    const MAX_RETRIES = 3;

    // Load Splide CSS first (if not already in your head)
    const loadSplideStyles = () => {
      console.log('Loading Splide CSS');
      if (!document.getElementById('splide-css')) {
        const link = document.createElement('link');
        link.id = 'splide-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
        document.head.appendChild(link);
        console.log('Splide CSS loaded');
      } else {
        console.log('Splide CSS already loaded');
      }
    };

    // Load Splide JS
    const loadSplideScript = () => {
      console.log('Loading Splide JS');
      return new Promise((resolve) => {
        if (window.Splide) {
          console.log('Splide already loaded in window');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
        script.onload = () => {
          console.log('Splide JS loaded successfully');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Error loading Splide JS:', error);
          resolve(); // Resolve anyway to avoid blocking
        };
        document.body.appendChild(script);
      });
    };

    // Initialize carousels using our existing carousel.js logic
    const initializeCarousels = () => {
      console.log('Initializing carousels');
      
      // Notify for testing purposes
      if (onInitializeStart && typeof onInitializeStart === 'function') {
        onInitializeStart();
      }
      
      if (!window.Splide) {
        console.error('Splide not available in window object');
        return;
      }
      
      // Check if we have any carousels in the DOM
      const allCarousels = document.querySelectorAll('.splide');
      console.log(`Found ${allCarousels.length} total splide carousels`);
      
      // Log IDs for debugging
      allCarousels.forEach((carousel, index) => {
        console.log(`Carousel #${index} with ID: ${carousel.id}, classes: ${carousel.className}`);
      });
      
      if (allCarousels.length === 0) {
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          console.log(`No carousels found. Retrying initialization (${retryCount}/${MAX_RETRIES})...`);
          setTimeout(initializeCarousels, 1000); // Retry after 1 second
        } else {
          console.log('Max retries reached. No carousels found.');
        }
        return;
      }
      
      // Initialize all carousels with consistent settings - no special cases
      const uninitializedCarousels = document.querySelectorAll('.splide:not(.is-initialized)');
      console.log(`Found ${uninitializedCarousels.length} uninitialized carousels`);
      
      uninitializedCarousels.forEach((carousel, index) => {
        try {
          console.log(`Initializing carousel #${index} with ID: ${carousel.id}`);
          const splide = new window.Splide(carousel, {
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

          // Get the progress bar
          const bar = carousel.querySelector('.my-carousel-progress-bar');
          if (bar) {
            // Update the progress bar when the carousel moves
            splide.on('mounted move', function () {
              const end = splide.Components.Controller.getEnd() + 1;
              const rate = Math.min((splide.index + 1) / end, 1);
              bar.style.width = String(100 * rate) + '%';
            });
          } else {
            console.warn(`Progress bar not found for ${carousel.id}`);
          }

          splide.mount();
          console.log(`Carousel ${carousel.id} initialized`);
        } catch (error) {
          console.error(`Error initializing carousel ${carousel.id}:`, error);
        }
      });
    };

    // Execute our loading sequence
    const init = async () => {
      try {
        loadSplideStyles();
        await loadSplideScript();
        
        // Small timeout to ensure DOM is fully loaded
        console.log('Setting timeout for carousel initialization');
        setTimeout(() => {
          console.log('Timeout elapsed, initializing carousels');
          initializeCarousels();
        }, 1000);
        
        // Also try after longer delay to catch any late-loading elements
        setTimeout(() => {
          const hasInitializedCarousels = document.querySelectorAll('.splide.is-initialized').length > 0;
          if (!hasInitializedCarousels) {
            console.log('No initialized carousels found after delay, trying again');
            initializeCarousels();
          }
        }, 3000);
      } catch (error) {
        console.error('Error in Splide initialization:', error);
      }
    };

    init();

    // Clean up function
    return () => {
      console.log('SplideInit component unmounting');
      // Clean up could remove event listeners if needed
    };
  }, [testMode, onInitializeStart]);

  // This component doesn't render anything visible
  return null;
} 