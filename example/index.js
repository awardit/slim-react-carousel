import React from 'react';
import ReactDOM from 'react-dom';

import { Carousel, Slides, SlideImg, Arrows, Dots } from '../src/index.js';

const Slide = () => <SlideImg src="http://via.placeholder.com/400x150" alt="" />;
const SlideGreen = () => <SlideImg src="http://via.placeholder.com/400x150/00ff00/ffffff" alt="" />;
const Slide2 = () => <a href="#"><SlideImg src="http://via.placeholder.com/400x150" alt=""/></a>;

ReactDOM.render(
<div>
  <h2>Slide</h2>
  <Carousel
    autoplay={true}
  >
    <Slides>
      <Slide /><Slide /><Slide /><Slide /><Slide />
    </Slides>
    <Arrows />
  </Carousel>

  <h2>Fade</h2>
  <Carousel
    autoplay={true}
    transition="fade"
    loopAround={true}
  >
    <Slides>
      <Slide /><SlideGreen /><Slide /><SlideGreen /><Slide />
    </Slides>
    <Dots />
  </Carousel>

  <h2>Slide with anchor tag around</h2>
  <Carousel
    loopAround={true}
  >
    <Slides>
      <Slide2 /><Slide2 /><Slide2 /><Slide2 /><Slide2 />
    </Slides>
    <Dots />
  </Carousel>

  <h2>Multiple at once</h2>
  <Carousel
    slidesToScroll={3}
    loopAround={true}
  >
    <Arrows />
    <Slides
    slidesToShow={3}
    slidePadding={10}>
      <Slide /><Slide /><Slide /><Slide /><Slide />
    </Slides>
  </Carousel>

  <h2>Vertical</h2>
  <Carousel>
    <Slides direction="y" style={{height: "150px", width: "400px"}}>
      <Slide /><Slide /><Slide /><Slide /><Slide />
    </Slides>
    <Arrows />
  </Carousel>
</div>
, document.getElementById('root'));
