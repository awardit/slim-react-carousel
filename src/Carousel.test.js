import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './Carousel';

it('renders with different number of children without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Carousel />, div);
  ReactDOM.render(<Carousel><div /></Carousel>, div);
  ReactDOM.render(<Carousel><div /><div /></Carousel>, div);
});
