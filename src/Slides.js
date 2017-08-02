import React, { Component, Children } from 'react';
import PropTypes from "prop-types";

import { CAROUSEL_CTX } from "./Carousel";

const styles = ({ slidePadding, slideWidth }) => ({
  float:       'left',
  width:       `${slideWidth}px`,
  paddingLeft: `${slidePadding}px`
});

const trackStyles = ({ slidePadding, currentSlide }, { slideWidth, trackWidth }, { touchCurrent, touchStart }) => {
  const touchDrag     = (touchCurrent && touchStart) ? touchCurrent.clientX - touchStart.clientX : 0;
  const xPos          = -(currentSlide * (slideWidth + slidePadding)) + touchDrag;

  return {
    transition: touchDrag ? '' : '0.4s ease-in-out transform',
    width:      trackWidth + 'px',
    transform:  'translateX(' + xPos + 'px)',
    overflowX:  'hidden'
  }
};

const frameStyles = ({ frameWidth }) => ({
  maxWidth:  frameWidth + 'px',
  transform: 'translateZ(0)',
  overflow:  'hidden'
});

export class TouchContainer extends Component {
  setEl = el => this.el = el;

  componentDidMount() {
    if( ! this.el) {
      return;
    }

    this.el.addEventListener('dragstart', this.onDragstart);

    this.el.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.el.addEventListener('mousedown', this.onTouchStart.bind(this));

    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('mouseup', this.onTouchEnd.bind(this));

    this.el.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.el.addEventListener('mousemove', this.onTouchMove.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('mouseup', this.onTouchEnd);

    if( ! this.el) {
      return;
    }

    this.el.removeEventListener('dragstart', this.onDragstart);

    this.el.removeEventListener('touchstart', this.onTouchStart);
    this.el.removeEventListener('mousedown', this.onTouchStart);

    this.el.removeEventListener('touchmove', this.onTouchMove);
    this.el.removeEventListener('mousemove', this.onTouchMove);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.currentSlide !== nextProps.currentSlide) {
      // Reset touch when the user interacts with the slider while we are dragging
      this.touchReset();
    }
  }

  getEventTouch(event) {
    if (typeof event.touches === 'undefined') {
      return {
        clientX: event.clientX,
        clientY: event.clientY
      };
    }

    if (!event.touches.length) {
      return null;
    }

    const ev = event.touches.item(0);

    return {
      clientX: ev.clientX,
      clientY: ev.clientY
    };
  }

  onDragstart = e => {
    e.preventDefault();
  }

  onTouchStart = e => {
    const touch = this.getEventTouch(e);

    this.context[CAROUSEL_CTX].stopAutoplay();

    this.setState({
      touchStart:   touch,
      touchCurrent: touch
    });
  }

  onTouchMove = e => {
    if ( ! this.state.touchStart) {
      return;
    }

    this.setState({
      touchCurrent: this.getEventTouch(e)
    });
  }

  onTouchEnd = e => {
    if ( ! this.state.touchStart) {
      return;
    }

    this.touchEnd(this.state.touchStart, this.state.touchCurrent);
    this.touchReset();
  }

  touchReset() {
    this.setState({
      touchStart:   null,
      touchCurrent: null,
    });

    this.context[CAROUSEL_CTX].registerAutoplay();
  }

  touchEnd(touchStart, touchEnd) {}
}

export class Slides extends TouchContainer {
  static defaultProps = {
    touchProp:     "clientX",
    dragThreshold: 80,
    slidePadding:  0,
    slidesToShow:  1,
  };

  static contextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state         = {};
    this.slideElements = [];
  }

  componentWillMount() {
    if( ! this.context[CAROUSEL_CTX] && process.env.NODE_ENV !== "production") {
      console.error("<Slides /> must be nested inside of a <Carousel />")
    }
  }

  componentDidMount() {
    TouchContainer.prototype.componentDidMount.call(this);

    this.context[CAROUSEL_CTX].setNumSlides(this.slideElements.length);

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    TouchContainer.prototype.componentWillUnmount.call(this);

    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if( ! this.el) {
      return;
    }

    this.forceUpdate();
  }

  touchEnd(touchStart, touchCurrent) {
    const prop = this.props.touchProp;

    if (touchCurrent[prop] > (touchStart[prop] + this.props.dragThreshold)) {
      this.context[CAROUSEL_CTX].prev();
    } else if (touchCurrent[prop] < (touchStart[prop] - this.props.dragThreshold)) {
      this.context[CAROUSEL_CTX].next();
    }
  }

  render() {
    const { children, currentSlide, slidesToShow, maxSlideWidth, slidePadding, numSlides, touchProp, dragThreshold,...props } = this.props;

    const wrapperWidth = this.el ? this.el.offsetWidth : 0;
    const slideWidth   = Math.min(maxSlideWidth, (wrapperWidth - slidePadding * (slidesToShow + 1)) / slidesToShow);
    const trackWidth   = (slideWidth + (slidePadding * 2)) * numSlides;
    const frameWidth   = Math.min((slideWidth + slidePadding) * slidesToShow + slidePadding, wrapperWidth);

    const data = {
      wrapperWidth,
      slideWidth,
      trackWidth,
      frameWidth,
    };

    return <div {...props} ref={this.setEl}>
      <div style={frameStyles(data)}>
        <div style={trackStyles(this.props, data, this.state)}>
        {Children.map(children, (slide, i) =>
          <div
            key={i}
            ref={s => this.slideElements[i] = s}
            style={styles({ slidePadding, slideWidth})}
          >
            {slide}
          </div>
        )}
        </div>
      </div>
    </div>;
  }
}

export class SlideImg extends Component {
  static contextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  };

  componentWillMount() {
    if( ! this.context[CAROUSEL_CTX] && process.env.NODE_ENV !== "production") {
      console.error("<SlideImg /> must be nested inside of a <Carousel />")
    }
  }

  registerImg = el => {
    const cb = () => {
      this.context[CAROUSEL_CTX].updateSlideWidth(el.naturalWidth);
    };

    if(el.complete) {
      cb();
    }
    else {
      el.onload = cb;
    }
  }

  render() {
    return <img style={{width: "100%"}} {...this.props} ref={this.registerImg} />;
  }
}
