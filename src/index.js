import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './Carousel';
import './index.css';

const Slide = () => <img src="http://via.placeholder.com/350x150" alt="" />;

ReactDOM.render(
<div>
  <h2>Normal</h2>
  <Carousel
    autoplay={true}
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>

  <h2>Multiple at once</h2>
  <Carousel
    autoplay={true}
    slidesToShow={2}
    slidesToScroll={2}
  >
    <Slide /><Slide /><Slide /><Slide /><Slide />
  </Carousel>
</div>
, document.getElementById('root'));
