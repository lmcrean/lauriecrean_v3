// Manual Splide initialization
(function() {
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
      splideScript.onload = initializeSplideCarousels;
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
    if (splideElements.length === 0) {
      console.log('No uninitialized splide elements found, skipping initialization');
      return;
    }
    
    console.log(`Found ${splideElements.length} uninitialized splide elements`);
    
    // Initialize basic carousels
    document.querySelectorAll('.splide:not(#odyssey-carousel):not(#coachmatrix-carousel):not(#steamreport-carousel):not(.is-initialized)').forEach(function(carousel, index) {
      console.log(`Initializing basic carousel #${index}`);
      try {
        new Splide(carousel, {
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
        console.log(`Basic carousel #${index} initialized successfully`);
      } catch (e) {
        console.error(`Error initializing basic carousel #${index}:`, e);
      }
    });
    
    // Initialize specific project carousels
    const projectCarousels = ['odyssey', 'coachmatrix', 'steamreport'];
    projectCarousels.forEach(function(id) {
      const carousel = document.querySelector(`#${id}-carousel:not(.is-initialized)`);
      if (carousel) {
        console.log(`Initializing project carousel: ${id}`);
        try {
          const splide = new Splide(carousel, {
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
            splide.on('mounted move', function() {
              const end = splide.Components.Controller.getEnd() + 1;
              const rate = Math.min((splide.index + 1) / end, 1);
              bar.style.width = String(100 * rate) + '%';
            });
          }
          
          splide.mount();
          console.log(`Project carousel ${id} initialized successfully`);
        } catch (e) {
          console.error(`Error initializing project carousel ${id}:`, e);
        }
      } else {
        console.log(`Project carousel ${id} not found in DOM or already initialized`);
      }
    });
  }

  // Initialize on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplide);
  } else {
    initSplide();
  }

  // Handle Docusaurus page transitions - initialize carousels after page changes
  // This is needed because Docusaurus uses client-side routing
  document.addEventListener('docusaurus.routeDidUpdate', function() {
    console.log('Route updated, reinitializing Splide carousels');
    setTimeout(initializeSplideCarousels, 100); // Small delay to ensure DOM is updated
  });
})(); 