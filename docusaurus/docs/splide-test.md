# Splide Test Page

This is a simple test page to verify that Splide is working correctly.

<section class="splide" aria-label="Simple Test Carousel">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">
        <div style={{backgroundColor: '#FF5733', padding: '50px', textAlign: 'center', color: 'white'}}>
          <h2>Slide 1</h2>
          <p>This is the first slide</p>
        </div>
      </li>
      <li class="splide__slide">
        <div style={{backgroundColor: '#33FF57', padding: '50px', textAlign: 'center', color: 'black'}}>
          <h2>Slide 2</h2>
          <p>This is the second slide</p>
        </div>
      </li>
      <li class="splide__slide">
        <div style={{backgroundColor: '#3357FF', padding: '50px', textAlign: 'center', color: 'white'}}>
          <h2>Slide 3</h2>
          <p>This is the third slide</p>
        </div>
      </li>
    </ul>
  </div>
  <div class="my-carousel-progress">
    <div class="my-carousel-progress-bar"></div>
  </div>
</section>

## Splide Implementation Details

This page is testing whether the Splide initialization in our Docusaurus setup is working correctly. The component should:

1. Load Splide CSS from CDN
2. Load Splide JS from CDN
3. Initialize all carousels on the page

If everything is working, you should see a colorful carousel above with three slides that you can navigate between. 