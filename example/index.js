import React from 'react';
import ReactDOM from 'react-dom';

import { Carousel, Slides, SlideImg, Arrows, Dots } from '../src/index.js';

const Slide = () => <SlideImg src="http://via.placeholder.com/400x150" alt="" />;
const Slide2 = () => <a href="#"><SlideImg src="http://via.placeholder.com/400x150" alt=""/></a>;

ReactDOM.render(
<div>
  <h2>Normal</h2>
  <Carousel
    autoplay={true}
  >
    <Slides>
      <Slide /><Slide /><Slide /><Slide /><Slide />
    </Slides>
    <Arrows />
  </Carousel>

  <h2>Slide with anchor tag around</h2>
  <Carousel
  >
    <Slides>
      <Slide2 /><Slide2 /><Slide2 /><Slide2 /><Slide2 />
    </Slides>
    <Dots />
  </Carousel>

  <h2>Multiple at once</h2>
  <Carousel
    slidesToScroll={3}
  >
    <Arrows />
    <Slides
    slidesToShow={3}
    slidePadding={10}>
      <Slide /><Slide /><Slide /><Slide /><Slide />
    </Slides>
  </Carousel>
</div>
, document.getElementById('root'));
