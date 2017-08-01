import React, { Component }  from 'react';
import PropTypes from 'prop-types';

const frameStyles = (_, { frameWidth }) => ({
  maxWidth:  frameWidth + 'px',
  transform: 'translateZ(0)',
  overflow:  'hidden'
});

const slideStyles = ({ slidePadding }, { slideWidth}) => ({
  float:  'left',
  width:   slideWidth   + 'px',
  paddingLeft: slidePadding + 'px'
});

const trackStyles = ({ slidePadding }, { current, slideWidth, trackWidth, touchCurrent, touchStart}) => {
  const touchDrag     = (touchCurrent && touchStart) ? touchCurrent - touchStart : 0;
  const xPos          = -(current * (slideWidth + slidePadding)) + touchDrag;

  return {
    transition: touchDrag ? '' : '0.3s ease-in transform',
    width:      trackWidth + 'px',
    transform:  'translateX(' + xPos + 'px)',
    overflowX:  'hidden'
  }
};

export default class Carousel extends Component {
  static PropTypes = {
    children       : PropTypes.array,
    slidesToShow   : PropTypes.number,
    slidesToScroll : PropTypes.number,
    loopAround     : PropTypes.bool,
    swiping        : PropTypes.bool,
    autoPlay       : PropTypes.bool,
    timer          : PropTypes.number,
    slidePadding   : PropTypes.string,
    controlType    : PropTypes.oneOf([ '', 'dots', 'nextPrev' ])
  };

  static defaultProps = {
    swiping        : true,
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
      current           : 0,
      slideWidth        : 0,
      initialSlideWidth : 0,
      trackWidth        : 0,
      touchStart        : null,
      touchCurrent      : null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize.bind(this));

    this.frameElement.addEventListener('dragstart', this.onDragstart);

    this.frameElement.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.frameElement.addEventListener('mousedown', this.onTouchStart.bind(this));

    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('mouseup', this.onTouchEnd.bind(this));

    this.frameElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.frameElement.addEventListener('mousemove', this.onTouchMove.bind(this));

    this.onSlideImageLoad(this.init.bind(this));

    if (this.props.autoplay) {
      this.startAutoplay();
    }

    this.boundNext = this.next.bind(this);
    this.boundPrev = this.prev.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));

    this.frameElement.removeEventListener('dragstart', this.onDragstart);

    this.frameElement.removeEventListener('touchstart', this.onTouchStart);
    this.frameElement.removeEventListener('mousedown', this.onTouchStart);

    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('mouseup', this.onTouchEnd);

    this.frameElement.removeEventListener('touchmove', this.onTouchMove);
    this.frameElement.removeEventListener('mousemove', this.onTouchMove);
  }

  onDragstart(e) {
    e.preventDefault();
  }

  onSlideImageLoad(cb) {
    if (!cb) {
      return;
    }

    if (this.wrapperElement) {
      const img = this.trackElement.querySelector('img');
      if (img) {
        img.onload = () => {
          cb(img);
        }

        if (img.complete) {
          cb(img);
        }
      } else {
        console.warn("slim-react-carousel must contain <img /> to work properly");
      }
    }
  }

  onResize() {
    this.updateDimensions();
  }

  getEventTouch(event) {
    if (typeof event.touches === 'undefined') {
      return event.clientX;
    }
    if (!event.touches.length) {
      return null;
    }
    return event.touches.item(0).clientX;
  }

  onTouchStart(e) {
    if (!this.props.swiping) {
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
  onClick(e) {
    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  }

  init(img) {
    const initialSlideWidth = this.getSlideOriginalWidth(img);

    this.setState({
      ...this.state,
      slideWidth:        initialSlideWidth,
      initialSlideWidth: initialSlideWidth
    }, () => {
      this.updateDimensions();
    });
  }

  resetTouch() {
    this.setState({
      ...this.state,
      touchStart   : null,
      touchCurrent : null
    });
  }

  setCurrent(index) {
    if (index => 0 && index <= this.props.children.length) {
      this.setState({
        ...this.state,
        current: index,
        touchStart   : null,
        touchCurrent : null
      });
    }
  }

  prev() {
    let prev = this.state.current - this.props.slidesToScroll;

    if (prev < 0) {
      if (!this.props.loopAround) {
        this.resetTouch();
        return false;
      }
      prev = this.getChildren().length - 1;
    }

    this.setCurrent(prev);
  }

  next() {
    let next = this.state.current + this.props.slidesToScroll;

    if (next > this.getChildren().length - 1) {
      if (!this.props.loopAround) {
        this.resetTouch();
        return false;
      }
      next = 0;
    }

    this.setCurrent(next);
  }

  tick() {
    this.next();
  }

  startAutoplay() {
    this.interval = setInterval(this.tick.bind(this), this.props.timer);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  updateDimensions() {
    const { slidesToShow, slidePadding } = this.props;

    const wrapperWidth = this.wrapperElement.offsetWidth;
    const slideWidth   = Math.min(this.state.initialSlideWidth, (wrapperWidth - slidePadding * (slidesToShow + 1)) / slidesToShow);
    const trackWidth   = (slideWidth + (slidePadding * 2)) * this.getChildren().length;
    const frameWidth   = Math.min((slideWidth + slidePadding) * slidesToShow + slidePadding, wrapperWidth);

    this.setState({
      ...this.state,
      wrapperWidth,
      slideWidth,
      frameWidth,
      trackWidth
    });
  }

  getSlideOriginalWidth(img) {
    if (img) {
      return img.naturalWidth;
    }

    const children = this.slideElements[0].childNodes;
    if (!children[0]) {
      return this.slideElements[0].offsetWidth;
    }
    if (children[0].tagName === 'IMG') {
      return children[0].naturalWidth;
    }
    return children[0].offsetWidth;
  }

  getChildren() {
    return this.props.children ? this.props.children : [];
  }

  render() {
    const { slidesToShow, slidePadding, controlType } = this.props;
    const { current, frameWidth } = this.state;

    const slidePaddings = slidePadding * 2;
    const children = this.getChildren();

    return (
      <div
        className="carousel wrapperElement"
        ref={x => this.wrapperElement = x}
      >
        <div
          className="frameElement"
          ref={x => this.frameElement = x}
          style={frameStyles(this.props, this.state)}
        >
          <div
            className="trackElement"
            ref={x => this.trackElement = x}
            onClick={this.onClick}
            style={trackStyles(this.props, this.state)}
          >
          {children.length && children.map((slide, i) =>
            <div
              key={i}
              ref={s => this.slideElements[i] = s}
              style={slideStyles(this.props, this.state)}
            >
              {slide}
            </div>
          )}
          </div>
        </div>
        <div className="carousel__controls"
            style={{ maxWidth: frameWidth + 'px' }}
        >
          {controlType === 'nextPrev' &&
            <div>
              <button onClick={this.boundPrev}>prev</button>
              <button onClick={this.boundNext}>next</button>
            </div>
          }
          {controlType === 'dots' &&
            <div>
              {Array.from({length: children.length}, (v, k) => k).map(x =>
                <button
                  key={x}
                  className={current === x ? 'carousel__dot carousel__dot--active' : 'carousel__dot'}
                  onClick={() => this.setCurrent(x)}
                >
                </button>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}
