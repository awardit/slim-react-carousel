import React, { Component }  from 'react';
import PropTypes from 'prop-types';

export default class Carousel extends Component {
  static PropTypes = {
    children:       PropTypes.array,
    slidesToShow:   PropTypes.number,
    slidesToScroll: PropTypes.number,
    loopAround:     PropTypes.bool,
    swiping:        PropTypes.bool,
    autoPlay:       PropTypes.bool,
    timer:          PropTypes.number,
    transitionTime: PropTypes.number,
    transitionType: PropTypes.string
  };

  static defaultProps = {
    timer: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  }

  constructor(props) {
    super(props);

    this.slideElements = [];

    this.state = {
      current: 0,
      slideWidth: 0
    };

    if (this.props.autoplay) {
      this.startAutoplay();
    }
  }

  componentDidMount() {
    document.addEventListener('resize', this.resize);

    this.setState({
      ...this.state,
      slideWidth: this.getSlideWidth()
    });

    this.onSlideImageLoad(this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.resize);
  }

  onSlideImageLoad(cb) {
    if (!cb) {
      return;
    }

    if (this.element) {
      const img = this.element.querySelector('img');
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

  resize() {
    this.updateDimensions();
  }

  prev() {
    let prev = this.state.current - this.props.slidesToScroll;

    if (prev < 0) {
      prev = this.props.children.length - 1;
    }

    this.setState({
      ...this.state,
      current: prev
    });
  }

  next() {
    let next = this.state.current + this.props.slidesToScroll;

    if (next > this.props.children.length - 1) {
      next = 0;
    }

    this.setState({
      ...this.state,
      current: next
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
    const { slidesToShow } = this.props;
    const { current, slideWidth } = this.state;
    const children = typeof this.props.children !== 'undefined' ? this.props.children : [];

    return (
      <div style={{ width: (slideWidth * slidesToShow) + 'px' }}
           ref={x => this.element = x}
      >
        <div style={{
              width: "100%",
              transform: "translateZ(0)",
              overflow: "hidden"
            }}
        >
          <div style={{
                transition: '0.3s ease-in transform',
              width: (slideWidth * children.length) + 'px',
              transform: "translateX(-" + (current * slideWidth) + "px)",
              overflowX: "hidden"
            }}
          >
          {children.length && children.map((slide, i) =>
            <div key={i}
                ref={s => this.slideElements[i] = s}
                style={{
                  float: 'left',
                  width: slideWidth + 'px'
                  }}>
              {slide}
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }
}
