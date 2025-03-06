import React, { useEffect } from 'react';

// This is a client-side only component
export default function SplideInit() {
  useEffect(() => {
    console.log('SplideInit component mounted');

    // Check if we're running in a browser environment
    if (typeof window === 'undefined') {
      console.log('Not in browser environment, skipping Splide initialization');
      return;
    }

    // Check if carousels are already initialized by our static script
    const alreadyInitialized = document.querySelectorAll('.splide.is-initialized').length > 0;
    if (alreadyInitialized) {
      console.log('Carousels already initialized by static script, skipping React initialization');
      return;
    }

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
      
      if (!window.Splide) {
        console.error('Splide not available in window object');
        return;
      }
      
      // Check if we have any carousels in the DOM
      const allCarousels = document.querySelectorAll('.splide');
      console.log(`Found ${allCarousels.length} total splide carousels`);
      
      // Basic carousels
      const basicCarousels = document.querySelectorAll('.splide:not(#odyssey-carousel):not(#coachmatrix-carousel):not(#steamreport-carousel)');
      console.log(`Found ${basicCarousels.length} basic carousels`);
      
      basicCarousels.forEach((carousel, index) => {
        try {
          console.log(`Initializing basic carousel #${index}`);
          new window.Splide(carousel, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            pagination: true,
            arrows: true,
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
          }).mount();
          console.log(`Basic carousel #${index} initialized`);
        } catch (error) {
          console.error(`Error initializing basic carousel #${index}:`, error);
        }
      });

      // Project carousels
      const projectCarousels = ['odyssey', 'coachmatrix', 'steamreport'];
      
      projectCarousels.forEach(id => {
        const carousel = document.querySelector(`#${id}-carousel`);
        if (carousel) {
          console.log(`Initializing project carousel: ${id}`);
          try {
            const splide = new window.Splide(carousel, {
              type: 'loop',
              perPage: 1,
              perMove: 1,
              gap: '1rem',
              arrows: true,
              pagination: false,
              autoplay: false,
              arrowPath: 'm15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z',
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
              console.warn(`Progress bar not found for ${id}-carousel`);
            }

            splide.mount();
            console.log(`Project carousel ${id} initialized`);
          } catch (error) {
            console.error(`Error initializing project carousel ${id}:`, error);
          }
        } else {
          console.log(`Project carousel ${id} not found in DOM`);
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
  }, []);

  // This component doesn't render anything visible
  return null;
} 