import React, { Component }  from 'react';
import PropTypes from 'prop-types';

export default class Carousel extends Component {
  static PropTypes = {
    children       : PropTypes.array,
    slidesToShow   : PropTypes.number,
    slidesToScroll : PropTypes.number,
    loopAround     : PropTypes.bool,
    swiping        : PropTypes.bool,
    autoPlay       : PropTypes.bool,
    timer          : PropTypes.number,
    transitionTime : PropTypes.number,
    transitionType : PropTypes.string,
    slidePadding   : PropTypes.string
  };

  static defaultProps = {
    timer          : 2000,
    dragThreshold  : 80,
    slidesToShow   : 1,
    slidesToScroll : 1,
    autoplay       : false,
    slidePadding   : 0
  }

  constructor(props) {
    super(props);

    this.slideElements = [];

    this.state = {
      current      : 0,
      slideWidth   : 0,
      touchStart   : null,
      touchCurrent : null
    };
  }

  componentDidMount() {
    document.addEventListener('resize', this.onResize);
    document.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));

    this.setState({
      ...this.state,
      slideWidth: this.getSlideWidth()
    });

    this.onSlideImageLoad(this.updateDimensions.bind(this));

    if (this.props.autoplay) {
      this.startAutoplay();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.onResize);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchmove', this.onTouchMove);
  }

  onSlideImageLoad(cb) {
    if (!cb) {
      return;
    }

    if (this.element) {
      const img = this.wrapperElement.querySelector('img');
      if (img) {
        img.onload = () => {
          cb();
        }

        if (img.complete) {
          cb();
        }
      }
    }
  }

  onResize() {
    this.updateDimensions();
  }

  getEventTouch(event) {
    if (!event.touches.length) {
      return null;
    }
    return event.touches.item(0).clientX;
  }

  onTouchStart(e) {
    if (!this.element.contains(e.target)) {
      return;
    }
    const touch = this.getEventTouch(e);

    this.setState({
      ...this.state,
      touchStart: touch,
      touchCurrent: touch
    });
  }

  onTouchMove(e) {
    if (this.state.touchStart === null) {
      return;
    }
    this.setState({
      ...this.state,
      touchCurrent: this.getEventTouch(e)
    });
  }

  onTouchEnd() {
    if (this.state.touchStart === null) {
      return;
    }

    if (this.state.touchCurrent > (this.state.touchStart + this.props.dragThreshold)) {
      this.prev();
    } else if (this.state.touchCurrent < (this.state.touchStart - this.props.dragThreshold)) {
      this.next();
    } else {
      this.setState({
        ...this.state,
        touchStart   : null,
        touchCurrent : null
      });
    }
  }

  resetTouch() {
    this.setState({
      ...this.state,
      touchStart   : null,
      touchCurrent : null
    });
  }

  prev() {
    let prev = this.state.current - this.props.slidesToScroll;

    if (prev < 0) {
      if (!this.props.loopAround) {
        this.resetTouch();
        return false;
      }
      prev = this.props.children.length - 1;
    }

    this.setState({
      ...this.state,
      current: prev,
      touchStart   : null,
      touchCurrent : null
    });
  }

  next() {
    let next = this.state.current + this.props.slidesToScroll;

    if (next > this.props.children.length - 1) {
      if (!this.props.loopAround) {
        this.resetTouch();
        return false;
      }
      next = 0;
    }

    this.setState({
      ...this.state,
      current: next,
      touchStart   : null,
      touchCurrent : null
    });
  }

  tick() {
    this.next();
  }

  startAutoplay() {
    this.interval = setInterval(this.tick.bind(this), this.props.timer);
  }

  stop() {
    clearInterval(this.interval);
  }

  updateDimensions() {
    this.setState({
      ...this.state,
      slideWidth: this.getSlideWidth()
    });
  }

  getSlideWidth() {
    if (!this.slideElements.length) {
      return null;
    }
    const children = this.slideElements[0].childNodes;
    if (!children[0]) {
      return this.slideElements[0].offsetWidth;
    }
    return children[0].offsetWidth;
  }

  render() {
    const { slidesToShow, slidePadding } = this.props;
    const { current, slideWidth, touchCurrent, touchStart } = this.state;

    const slidePaddings = slidePadding * 2;
    const children  = typeof this.props.children !== 'undefined' ? this.props.children : [];
    const touchDrag = (touchCurrent && touchStart) ? touchCurrent - touchStart : 0;
    const xPos      = -(current * (slideWidth + slidePaddings)) + touchDrag;

    return (
      <div
        ref={x => this.element = x}
        style={{ width: ((slideWidth + slidePaddings) * slidesToShow) + 'px' }}
      >
        <div
          style={{
            width: "100%",
            transform: "translateZ(0)",
            overflow: "hidden"
          }}
        >
          <div
            ref={x => this.wrapperElement = x}
            style={{
              transition: touchDrag ? '' : '0.3s ease-in transform',
              width: (slideWidth + slidePaddings) * children.length + 'px',
              transform: "translateX(" + xPos + "px)",
              overflowX: "hidden"
            }}
          >
          {children.length && children.map((slide, i) =>
            <div
              key={i}
              ref={s => this.slideElements[i] = s}
              style={{
                float: 'left',
                width: slideWidth + 'px',
                padding: slidePadding + 'px'
              }}
            >
              {slide}
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }
}
