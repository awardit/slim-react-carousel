import React from 'react';
import ReactDOM from 'react-dom';

import Carousel from '../src/index.js';

const Slide = () => <img src="http://via.placeholder.com/400x150" alt="" />;
const Slide2 = () => <a href="#"><img src="http://via.placeholder.com/400x150" alt=""/></a>;

ReactDOM.render(
<div>
  <h2>Normal</h2>
  <Carousel
    controlType="dots"
    autoplay={true}
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>

  <h2>Slide with anchor tag around</h2>
  <Carousel
    controlType="dots"
  >
    <Slide2 /><Slide2 /><Slide2 /><Slide2 /><Slide2 />
  </Carousel>

  <h2>Multiple at once</h2>
  <Carousel
    slidesToShow={3}
    slidesToScroll={3}
    slidePadding={10}
    controlType="nextPrev"
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>
</div>
, document.getElementById('root'));
