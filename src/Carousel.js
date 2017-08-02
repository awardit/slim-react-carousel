import React, { Component, Children, cloneElement }  from 'react';
import PropTypes from 'prop-types';

export const CAROUSEL_CTX = "@slim-react-carousel";

export default class Carousel extends Component {
  static PropTypes = {
    children           : PropTypes.array,
    slidesToScroll     : PropTypes.number,
    loopAround         : PropTypes.bool,
    autoplay           : PropTypes.bool,
    timer              : PropTypes.number,
    resetOnInteraction : PropTypes.bool,
  };

  static defaultProps = {
    timer              : 2000,
    slidesToScroll     : 1,
    loopAround         : false,
    autoplay           : false,
    resetOnInteraction : true
  }

  static childContextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      current    : 0,
      numSlides  : 0,
      slideWidth : 0,
    };
  }

  getChildContext = () => ({
    [CAROUSEL_CTX]: this
  })

  componentDidMount() {
    this.registerAutoplay();
  }

  componentWillUnmount() {
    this.stopAutoplay();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.autoplay !== nextProps.autoplay) {
      this.registerAutoplay(nextProps.autoplay);
    }
  }

  registerAutoplay(autoplay = this.props.autoplay) {
    this.stopAutoplay();

    if (autoplay) {
      this.startAutoplay();
    }
  }

  setCurrent(index) {
    const { numSlides } = this.state;

    this.setState({
      current: Math.min(Math.max(index, 0), numSlides - 1),
    });

    if(this.props.resetOnInteraction) {
      this.registerAutoplay();
    }
  }

  modifyCurrent(diff) {
    const { current, numSlides } = this.state;

    const idx = (diff % numSlides);

    this.setState({
      current: idx < 0 ? (numSlides + idx) : idx
    });

    if(this.props.resetOnInteraction) {
      this.registerAutoplay();
    }
  }

  prev() {
    if(this.props.loopAround) {
      this.modifyCurrent(-this.props.slidesToScroll);
    }
    else {
      this.setCurrent(this.state.current - this.props.slidesToScroll);
    }
  }

  next() {
    if(this.props.loopAround) {
      this.modifyCurrent(this.props.slidesToScroll);
    }
    else {
      this.setCurrent(this.state.current + this.props.slidesToScroll);
    }
  }

  updateSlideWidth(newWidth) {
    if(newWidth < this.state.slideWidth) {
      return;
    }

    this.setSlideWidth(newWidth);
  }

  setSlideWidth(slideWidth) {
    this.setState({ slideWidth });
  }

  setNumSlides(numSlides) {
    this.setState({
      numSlides,
      current: Math.min(Math.max(this.state.current, 0), numSlides - 1),
    });
  }

  startAutoplay() {
    this.interval = setInterval(this.next.bind(this), this.props.timer);
  }

  stopAutoplay() {
    clearInterval(this.interval);
  }

  render() {
    const { children, slidesToScroll, loopAround, autoplay, timer, resetOnInteraction, ...props } = this.props;

    return <div {...props}>{Children.map(children, c => cloneElement(c, {
      currentSlide:  this.state.current,
      numSlides:     this.state.numSlides,
      maxSlideWidth: this.state.slideWidth,
    }))}</div>;
  }
}
