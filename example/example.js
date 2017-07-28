import React from 'react';
import ReactDOM from 'react-dom';

import Carousel from '../dist/index.js';

const Slide = () => <img src="http://via.placeholder.com/400x150" alt="" />;

ReactDOM.render(
<div>
  <h2>Normal</h2>
  <Carousel
    controlType="dots"
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>

  <h2>Cell padding</h2>
  <Carousel
    slidePadding={10}
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>

  <h2>Multiple at once</h2>
  <Carousel
    autoplay={false}
    slidesToShow={2}
    slidesToScroll={2}
    slidePadding={10}
    controlType="nextPrev"
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>
</div>
, document.getElementById('root'));
