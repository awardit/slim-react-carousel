import { test }           from 'tap';
import React              from 'react';
import PropTypes          from 'prop-types';
import { shallow, mount } from 'enzyme';
import jsdom              from 'jsdom';

import { Carousel, Slides } from '../src/index.js';

function startDocument(doc) {
  global.document  = jsdom.jsdom(doc);
  global.window    = document.defaultView;
  global.Text      = window.Text;
  global.navigator = { userAgent: 'node.js' };
}

test('<Slides />', t =>  {
  t.afterEach(done => {
    global.window && global.window.close();

    delete global.window;
    delete global.document;
    delete global.navigator;

    done();
  });

  t.test('default', t => {
    startDocument();
    const c = mount(
      <Carousel>
        <Slides>
        </Slides>
      </Carousel>
    );

    t.equal(c.state().numSlides, 0);
    t.equal(c.state().current, 0);
    t.equal(c.state().slideRect.x, 0);
    t.equal(c.state().slideRect.y, 0);

    t.end();
  });

  t.test('slidesToScroll=1, slides=5, slidesToShow=1', t => {
    startDocument();
    const c = mount(
      <Carousel slidesToScroll={1}>
        <Slides slidesToShow={1}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </Slides>
      </Carousel>
    );

    t.equal(c.state().current, 0);
    t.equal(c.state().numSlides, 5);

    c.instance().next();

    t.equal(c.state().current, 1);
    t.equal(c.state().numSlides, 5);

    c.instance().next();

    t.equal(c.state().current, 2);
    t.equal(c.state().numSlides, 5);

    t.end();
  });

  t.test('slidesToScroll=1, slides=5, slidesToShow=3', t => {
    startDocument();
    const c = mount(
      <Carousel slidesToScroll={1}>
        <Slides slidesToShow={3}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </Slides>
      </Carousel>
    );

    t.equal(c.state().current, 0);
    t.equal(c.state().numSlides, 5);

    c.instance().next();

    t.equal(c.state().current, 1);
    t.equal(c.state().numSlides, 5);

    c.instance().next();

    t.equal(c.state().current, 2);
    t.equal(c.state().numSlides, 5);

    t.end();
  });

  t.end();
});
