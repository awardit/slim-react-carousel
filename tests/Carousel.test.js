import { test }           from 'tap';
import React              from 'react';
import { shallow, mount } from 'enzyme';
import jsdom              from 'jsdom';

import { Carousel, CAROUSEL_CTX } from '../src/index.js';

function startDocument(doc) {
  global.document  = jsdom.jsdom(doc);
  global.window    = document.defaultView;
  global.Text      = window.Text;
  global.navigator = { userAgent: 'node.js' };
}


test('render <Carousel />', t => {
  const c = shallow(<Carousel></Carousel>);

  t.equal(c.state().numSlides, 0);
  t.equal(c.state().current, 0);
  t.equal(c.state().slideRect.x, 0);
  t.equal(c.state().slideRect.y, 0);
  t.end();
});

class DummySlides extends React.Component {
  static contextTypes = {
    [CAROUSEL_CTX]: React.PropTypes.object
  }

  componentDidMount() {
    this.context[CAROUSEL_CTX].setNumSlides(this.props.slides);
  }
  render() { return <span />; }
}

test('Correctly change page when displaying multiple slides and using an uneven number of Slides', t => {
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

test('Loop around moving forward', t => {
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

test('Don\'t loop around moving forward', t => {
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

test('Loop around moving backward', t => {
  startDocument();
  const c = mount(
    <Carousel slidesToScroll={3} loopAround={true}>
      <DummySlides slides={5} />
    </Carousel>
  );

  t.equal(c.state().current, 0);
  t.equal(c.state().numSlides, 5);

  c.instance().prev();

  t.equal(c.state().current, 2);
  t.equal(c.state().numSlides, 5);

  c.instance().prev();

  t.equal(c.state().current, 0);
  t.equal(c.state().numSlides, 5);

  t.end();
});

test('Don\'t loop around moving backward', t => {
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
