# Splide Test Page

This is a simple test page to verify that Splide is working correctly.

<div id="splide-debug-info">
Loading splide...
</div>

<section className="splide" id="test-splide-carousel" aria-label="Simple Test Carousel">
  <div className="splide__track">
    <ul className="splide__list">
      <li className="splide__slide">
        <div style={{backgroundColor: '#FF5733', padding: '50px', textAlign: 'center', color: 'white'}}>
          <h2>Slide 1</h2>
          <p>This is the first slide</p>
        </div>
      </li>
      <li className="splide__slide">
        <div style={{backgroundColor: '#33FF57', padding: '50px', textAlign: 'center', color: 'black'}}>
          <h2>Slide 2</h2>
          <p>This is the second slide</p>
        </div>
      </li>
      <li className="splide__slide">
        <div style={{backgroundColor: '#3357FF', padding: '50px', textAlign: 'center', color: 'white'}}>
          <h2>Slide 3</h2>
          <p>This is the third slide</p>
        </div>
      </li>
    </ul>
  </div>
  <div className="my-carousel-progress">
    <div className="my-carousel-progress-bar"></div>
  </div>
</section>

<div id="splide-debug-script">
{/* 
In MDX, we can't use a normal script tag. Instead, we'll use client-side code that will be injected via our SplideInit component.
The debug output above will help us understand what's happening.
*/}
</div>

## Splide Implementation Details

This page is testing whether the Splide initialization in our Docusaurus setup is working correctly. The component should:

1. Load Splide CSS from CDN
2. Load Splide JS from CDN
3. Initialize all carousels on the page

If everything is working, you should see a colorful carousel above with three slides that you can navigate between. 