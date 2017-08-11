import { test }           from 'tap';
import React              from 'react';
import PropTypes          from 'prop-types';
import { shallow, mount } from 'enzyme';
import jsdom              from 'jsdom';

import { Carousel, CAROUSEL_CTX } from '../src/index.js';

function startDocument(doc) {
  global.document  = jsdom.jsdom(doc);
  global.window    = document.defaultView;
  global.Text      = window.Text;
  global.navigator = { userAgent: 'node.js' };
}

class DummySlides extends React.Component {
  static contextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  }

  componentDidMount() {
    this.context[CAROUSEL_CTX].setNumSlides(this.props.slides);
  }
  render() { return <span />; }
}

test('<Carousel />', t =>  {
  t.afterEach(done => {
    global.window && global.window.close();

    delete global.window;
    delete global.document;
    delete global.navigator;

    done();
  });

  t.test('default', t => {
    const c = shallow(<Carousel></Carousel>);

    t.equal(c.state().numSlides, 0);
    t.equal(c.state().current, 0);
    t.equal(c.state().slideRect.x, 0);
    t.equal(c.state().slideRect.y, 0);
    t.end();
  });

  t.test('next()', t => {
    t.test('slidesToScroll=3, slides=5', t => {
      startDocument();
      const c = mount(
        <Carousel slidesToScroll={3}>
          <DummySlides slides={5} />
        </Carousel>
      );

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().next();

      t.equal(c.state().current, 3);
      t.equal(c.state().numSlides, 5);

      c.instance().next();

      t.equal(c.state().current, 3);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.test('loopAround=true, slides=3', t => {
      startDocument();
      const c = mount(
        <Carousel loopAround={true}>
          <DummySlides slides={3} />
        </Carousel>
      );

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 3);

      c.instance().next();

      t.equal(c.state().current, 1);
      t.equal(c.state().numSlides, 3);

      c.instance().next();

      t.equal(c.state().current, 2);
      t.equal(c.state().numSlides, 3);

      c.instance().next();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 3);

      c.instance().next();

      t.equal(c.state().current, 1);
      t.equal(c.state().numSlides, 3);

      t.end();
    });

    t.test('slidesToScroll=3, slides=5, loopAround=true', t => {
      startDocument();
      const c = mount(
        <Carousel slidesToScroll={3} loopAround={true}>
          <DummySlides slides={5} />
        </Carousel>
      );

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().next();

      t.equal(c.state().current, 3);
      t.equal(c.state().numSlides, 5);

      c.instance().next();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.end();
  });

  t.test('prev()', t => {
    t.test('slidesToScroll=1, slides=5, loopAround=false', t => {
      startDocument();
      const c = mount(
        <Carousel>
          <DummySlides slides={5} />
        </Carousel>
      );

      c.instance().setCurrent(1);

      t.equal(c.state().current, 1);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.test('slidesToScroll=3, slides=5, loopAround=true', t => {
      startDocument();
      const c = mount(
        <Carousel loopAround={true}>
          <DummySlides slides={5} />
        </Carousel>
      );

      t.equal(c.state().current, 0);

      c.instance().setCurrent(2);

      t.equal(c.state().current, 2);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 1);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 5);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.test('slidesToScroll=3, slides=5, loopAround=false', t => {
      startDocument();
      const c = mount(
        <Carousel slidesToScroll={3}>
          <DummySlides slides={5} />
        </Carousel>
      );

      c.instance().setCurrent(3);

      t.equal(c.state().current, 3);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.test('slidesToScroll=3, slides=5, loopAround=true', t => {
      startDocument();
      const c = mount(
        <Carousel slidesToScroll={3} loopAround={true}>
          <DummySlides slides={5} />
        </Carousel>
      );

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 3);
      t.equal(c.state().numSlides, 5);

      c.instance().prev();

      t.equal(c.state().current, 0);
      t.equal(c.state().numSlides, 5);

      t.end();
    });

    t.end();
  });

  t.end();
});


