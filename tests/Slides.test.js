import { test } from 'tap';
import React from 'react';
import { shallow } from 'enzyme';

import { Carousel, Slides, SlideImg, Arrows, Dots } from '../src/index.js';

test('render <Slides />', t => {
  const c = shallow(
  <Carousel>
    <Slides>
    </Slides>
  </Carousel>);

  t.equal(c.state().numSlides, 0);
  t.equal(c.state().current, 0);
  t.equal(c.state().slideRect.x, 0);
  t.equal(c.state().slideRect.y, 0);
  t.end();
});
