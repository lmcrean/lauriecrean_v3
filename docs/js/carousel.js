document.addEventListener('DOMContentLoaded', function() {
    const carousels = ['odyssey', 'coachmatrix', 'steamreport', 'hoverboard'];
    
    carousels.forEach(id => {
        const carousel = new Splide(`#${id}-carousel`, {
            type: 'slide',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            pagination: false,
            arrows: true
        });

        // Create and update progress bar
        const progressBar = document.querySelector(`#${id}-carousel .my-carousel-progress-bar`);
        
        // Update progress bar on mount and move
        carousel.on('mounted move', function() {
            const end = carousel.Components.Controller.getEnd() + 1;
            const rate = Math.min((carousel.index + 1) / end, 1);
            progressBar.style.width = String(100 * rate) + '%';
        });

        carousel.mount();
    });
}); 