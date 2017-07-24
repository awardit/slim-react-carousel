import { test } from 'tap';
import jsdom from 'jsdom';

import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server'
import Carousel from '../src/Carousel';

test('renders with different number of children without crashing', t => {
  renderToString(<Carousel />);
  renderToString(<Carousel><div /></Carousel>);
  renderToString(<Carousel><div /><div /></Carousel>);

  t.end();
});
