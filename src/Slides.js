import React from 'react';
import PropTypes from "prop-types";

import CarouselContext from './CarouselContext';

const delta = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
  x: x1 - x2,
  y: y1 - y2,
});

const splitWPadding = (length, num, padding) => (length - padding * (num + 1)) / num;

const slideDefault = ({ direction, slidePadding, slide }) => ({
  float:       'left',
  width:       direction === "x" ? `${slide}px` : null,
  height:      direction === "y" ? `${slide}px` : null,
  paddingLeft: direction === "x" ? `${slidePadding}px` : null,
  paddingTop:  direction === "y" ? `${slidePadding}px` : null,
});

const trackDefault = ({ slidePadding, currentSlide, direction, slide, track, dragDelta }) => {
  const pos = -(currentSlide * (slide + slidePadding)) + dragDelta;

  return {
    transition: dragDelta ? '' : '0.4s ease-in-out transform',
    width:      direction === "x" ? track + 'px' : null,
    height:     direction === "y" ? track + 'px' : null,
    transform:  'translate' + direction.toUpperCase() + '(' + pos + 'px)',
  }
};

const frameDefault = ({ frame, direction }) => ({
  maxWidth:  direction === "x" ? frame + 'px' : null,
  maxHeight: direction === "y" ? frame + 'px' : null,
  overflowX:  direction === "x" ? 'hidden' : null,
  overflowY:  direction === "y" ? 'hidden' : null,
  transform: 'translateZ(0)',
});

export class TouchContainer extends React.Component {
  static contextType = CarouselContext;

  setEl = el => this.el = el;

  componentDidMount() {
    if (!this.el) return;

    this.carouselContext = this.context;

    this.el.addEventListener('dragstart', this.onDragstart);

    this.el.addEventListener('touchstart', this.onTouchStart);
    this.el.addEventListener('mousedown',  this.onTouchStart);

    this.el.addEventListener('touchmove', this.onTouchMove);
    this.el.addEventListener('mousemove', this.onTouchMove);

    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('mouseup', this.onTouchEnd);
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('mouseup', this.onTouchEnd);

    if (!this.el) return;

    this.el.removeEventListener('dragstart', this.onDragstart);

    this.el.removeEventListener('touchstart', this.onTouchStart);
    this.el.removeEventListener('mousedown', this.onTouchStart);

    this.el.removeEventListener('touchmove', this.onTouchMove);
    this.el.removeEventListener('mousemove', this.onTouchMove);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentSlide !== nextProps.currentSlide) {
      // Reset touch when the user interacts with the slider while we are dragging
      this.touchReset();
    }
  }

  getEventTouch(event) {
    if (typeof event.touches === 'undefined') {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }

    if (!event.touches.length) return null;

    const ev = event.touches.item(0);

    return {
      x: ev.clientX,
      y: ev.clientY
    };
  }

  onDragstart = e => e.preventDefault();

  onTouchStart = e => {
    const touch = this.getEventTouch(e);

    this.carouselContext.stopAutoplay();

    this.setState({
      touchStart:   touch,
      touchCurrent: touch
    });
  }

  onTouchMove = e => {
    if (!this.state.touchStart) return;

    this.setState({
      touchCurrent: this.getEventTouch(e)
    });
  }

  onTouchEnd = e => {
    if (!this.state.touchStart) return;

    this.touchEnd(this.state.touchStart, this.state.touchCurrent);
    this.touchReset();
  }

  touchReset() {
    this.setState({
      touchStart:   null,
      touchCurrent: null,
    });

    this.carouselContext.registerAutoplay();
  }

  touchEnd(touchStart, touchEnd) {}
}

export class Slides extends TouchContainer {
  static propTypes = {
    direction:     PropTypes.string,
    dragThreshold: PropTypes.number,
    slidePadding:  PropTypes.number,
    slidesToShow:  PropTypes.number,
  };

  static defaultProps = {
    direction:     "x",
    dragThreshold: 80,
    slidePadding:  0,
    slidesToShow:  1,
    frameStyles:   frameDefault,
    trackStyles:   trackDefault,
    slideStyles:   slideDefault,
  };

  static contextType = CarouselContext;

  constructor(props) {
    super(props);

    this.state         = {};
    this.slideElements = [];
  }

  componentWillMount() {
    if (!this.context && process.env.NODE_ENV !== "production") {
      console.error("<Slides /> must be nested inside of a <Carousel />")
    }
  }

  componentDidMount() {
    TouchContainer.prototype.componentDidMount.call(this);

    this.context.setNumSlides(this.slideElements.length);

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    TouchContainer.prototype.componentWillUnmount.call(this);

    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    if (!this.el) return;

    this.forceUpdate();
  }

  touchEnd(touchStart, touchCurrent) {
    const prop = this.props.direction;

    if (touchCurrent[prop] > (touchStart[prop] + this.props.dragThreshold)) {
      this.carouselContext.prev();
    } else if (touchCurrent[prop] < (touchStart[prop] - this.props.dragThreshold)) {
      this.carouselContext.next();
    }
  }

  render() {
    const {
      children,
      slidesToShow,
      maxSlideRect,
      slidePadding,
      numSlides,
      direction,
      dragThreshold,
      frameStyles,
      trackStyles,
      slideStyles,
      slidesToScroll,
      currentPage,
      currentSlide,
      numPages,
      ...props
    } = this.props;

    const { touchCurrent, touchStart } = this.state;

    const dragDelta = (touchCurrent && touchStart ? delta(touchCurrent, touchStart) : { x: 0, y: 0 })[direction];
    const wrapper   = (this.el ? { x: this.el.offsetWidth, y: this.el.offsetHeight } : { x: 0, y: 0 })[direction];
    const maxSlide  = maxSlideRect[direction];
    const slide     = Math.min(maxSlide, splitWPadding(wrapper, slidesToShow, slidePadding));
    const track     = (slide + (slidePadding * 2)) * numSlides;
    const frame     = Math.min((slide + slidePadding) * slidesToShow + slidePadding, wrapper);

    const data = {
      direction,
      slidePadding,
      currentSlide: ((currentSlide / slidesToScroll) | 0) * slidesToScroll,
      slidesToShow,
      dragDelta,
      wrapper,
      slide,
      track,
      frame,
    };

    return (
      <div { ...props } ref={this.setEl}>
        <div style={frameStyles(data)}>
          <div style={trackStyles(data)}>
            {React.Children.map(children, (child, i) => (
              <div
                key={i}
                ref={s => this.slideElements[i] = s}
                style={slideStyles(data)}
              >
                {child}
                <p>{i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export class SlideImg extends React.Component {
  static contextType = CarouselContext;

  componentWillMount() {
    if (!this.context && process.env.NODE_ENV !== "production") {
      console.error("<SlideImg /> must be nested inside of a <Carousel />");
    }
  }

  render() {
    const registerImg = el => {
      if (!el) return;

      const cb = () => {
        this.context.updateSlideRect({
          x: el.naturalWidth,
          y: el.naturalHeight,
        });
      }

      if (el.complete) cb();
      else el.onload = cb;
    };

    return <img style={{width: "100%"}} {...this.props} ref={registerImg} />;
  }
}
