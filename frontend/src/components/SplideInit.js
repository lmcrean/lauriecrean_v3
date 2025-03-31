import React, { useEffect } from 'react';

// This is a client-side only component
export default function SplideInit({ testMode = false, onInitializeStart = null }) {
  useEffect(() => {
    console.log('[SplideInit] Component mounted');

    // Check if we're running in a browser environment
    if (typeof window === 'undefined') {
      console.log('[SplideInit] Not in browser environment, skipping Splide initialization');
      return;
    }

    // Retry counter to avoid infinite retries
    let retryCount = 0;
    const MAX_RETRIES = 5;

    // Load Splide CSS first (if not already in your head)
    const loadSplideStyles = () => {
      console.log('[SplideInit] Loading Splide CSS');
      if (!document.getElementById('splide-css')) {
        const link = document.createElement('link');
        link.id = 'splide-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
        document.head.appendChild(link);
        console.log('[SplideInit] Splide CSS loaded');
      } else {
        console.log('[SplideInit] Splide CSS already loaded');
      }
    };

    // Load Splide JS
    const loadSplideScript = () => {
      console.log('[SplideInit] Loading Splide JS');
      return new Promise((resolve) => {
        if (window.Splide) {
          console.log('[SplideInit] Splide already loaded in window');
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
        script.onload = () => {
          console.log('[SplideInit] Splide JS loaded successfully');
          resolve(true);
        };
        script.onerror = (error) => {
          console.error('[SplideInit] Error loading Splide JS:', error);
          resolve(false); // Resolve with false to indicate failure
        };
        document.body.appendChild(script);
      });
    };

    // Initialize carousels
    const initializeCarousels = () => {
      console.log('[SplideInit] Initializing carousels');
      
      // Notify for testing purposes
      if (onInitializeStart && typeof onInitializeStart === 'function') {
        onInitializeStart();
      }
      
      if (!window.Splide) {
        console.error('[SplideInit] Splide not available in window object');
        return false;
      }
      
      // Check if we have any carousels in the DOM
      const allCarousels = document.querySelectorAll('.splide');
      console.log(`[SplideInit] Found ${allCarousels.length} total splide carousels`);
      
      // Log IDs for debugging
      allCarousels.forEach((carousel, index) => {
        console.log(`[SplideInit] Carousel #${index} with ID: ${carousel.id}, classes: ${carousel.className}`);
      });
      
      if (allCarousels.length === 0) {
        retryCount++;
        console.log(`[SplideInit] No carousels found. Retry count: ${retryCount}/${MAX_RETRIES}`);
        return false;
      }
      
      // Initialize all carousels that aren't already initialized
      const uninitializedCarousels = document.querySelectorAll('.splide:not(.is-initialized)');
      console.log(`[SplideInit] Found ${uninitializedCarousels.length} uninitialized carousels`);
      
      let successCount = 0;
      
      uninitializedCarousels.forEach((carousel, index) => {
        try {
          console.log(`[SplideInit] Initializing carousel #${index} with ID: ${carousel.id}`);
          
          // Check if we already have a progress bar
          let progressBar = carousel.querySelector('.my-carousel-progress-bar');
          let progressBarContainer = carousel.querySelector('.my-carousel-progress');
          
          // Create progress bar if it doesn't exist
          if (!progressBar) {
            console.log(`[SplideInit] Adding progress bar to ${carousel.id}`);
            progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'my-carousel-progress';
            progressBar = document.createElement('div');
            progressBar.className = 'my-carousel-progress-bar';
            progressBarContainer.appendChild(progressBar);
            carousel.appendChild(progressBarContainer);
          }
          
          const splide = new window.Splide(carousel, {
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
          splide.on('mounted move', function () {
            try {
              const end = splide.Components.Controller.getEnd() + 1;
              const rate = Math.min((splide.index + 1) / end, 1);
              progressBar.style.width = String(100 * rate) + '%';
            } catch (e) {
              console.error(`[SplideInit] Error updating progress bar: ${e.message}`);
            }
          });

          splide.mount();
          console.log(`[SplideInit] Carousel ${carousel.id} initialized successfully`);
          successCount++;
        } catch (error) {
          console.error(`[SplideInit] Error initializing carousel ${carousel.id}:`, error);
        }
      });
      
      return successCount > 0;
    };

    // Execute our loading sequence
    const init = async () => {
      try {
        loadSplideStyles();
        const scriptLoaded = await loadSplideScript();
        
        if (!scriptLoaded) {
          console.error('[SplideInit] Failed to load Splide script, aborting initialization');
          return;
        }
        
        // Try initialization immediately
        let success = initializeCarousels();
        
        // If not successful, retry with exponential backoff
        if (!success) {
          const retryDelays = [100, 500, 1000, 2000, 5000];
          
          for (let i = 0; i < Math.min(MAX_RETRIES, retryDelays.length) && retryCount < MAX_RETRIES; i++) {
            await new Promise(resolve => setTimeout(resolve, retryDelays[i]));
            console.log(`[SplideInit] Retrying initialization after ${retryDelays[i]}ms delay`);
            success = initializeCarousels();
            if (success) break;
          }
        }
        
        // Final check after all retries
        if (!success && retryCount >= MAX_RETRIES) {
          console.warn('[SplideInit] Failed to initialize carousels after maximum retries');
        }
      } catch (error) {
        console.error('[SplideInit] Error in Splide initialization:', error);
      }
    };

    init();

    // Clean up function
    return () => {
      console.log('[SplideInit] Component unmounting');
      // We don't need to clean up carousels here since they'll be removed with the DOM
    };
  }, [testMode, onInitializeStart]);

  // This component doesn't render anything visible
  return null;
} 