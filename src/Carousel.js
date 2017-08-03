import React, { Component, Children, cloneElement }  from 'react';
import PropTypes from 'prop-types';

export const CAROUSEL_CTX = "@slim-react-carousel";

export class Carousel extends Component {
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
      current   : 0,
      numSlides : 0,
      slideRect : {
        x: 0,
        y: 0,
      },
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

  /**
   * @api
   */
  setCurrent(index) {
    const { numSlides } = this.state;

    this.setState({
      current: Math.min(Math.max(index, 0), numSlides - 1),
    });

    if(this.props.resetOnInteraction) {
      this.registerAutoplay();
    }
  }

  /**
   * @api
   */
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

  /**
   * @api
   */
  prev() {
    if(this.props.loopAround) {
      this.modifyCurrent(-this.props.slidesToScroll);
    }
    else {
      this.setCurrent(this.state.current - this.props.slidesToScroll);
    }
  }

  /**
   * @api
   */
  next() {
    if(this.props.loopAround) {
      this.modifyCurrent(this.props.slidesToScroll);
    }
    else {
      this.setCurrent(this.state.current + this.props.slidesToScroll);
    }
  }

  /**
   * @api
   */
  updateSlideRect({ x, y }) {
    const { x: oX, y: oY } = this.state.slideRect;

    x = Math.max(x, oX);
    y = Math.max(y, oY);

    if(x === oX && y === oY) {
      return;
    }

    this.setSlideRect({ x, y });
  }

  /**
   * Sets the maximum slide width used for the slider, prefer to use `updateSlideWidth` instead.
   *
   * @api
   */
  setSlideRect({ x, y }) {
    this.setState({ slideRect: { x, y } });
  }

  /**
   * @api
   */
  setNumSlides(numSlides) {
    console.log(this.state.current)
    this.setState({
      numSlides,
      current: Math.min(Math.max(this.state.current, 0), Math.max(numSlides - 1, 0)),
    });
  }

  /**
   * Resets autoplay timer and will re-register the callback if `autoplay` is true.
   *
   * @api
   */
  registerAutoplay(autoplay = this.props.autoplay) {
    this.stopAutoplay();

    if (autoplay) {
      this.startAutoplay();
    }
  }

  /**
   * @api
   */
  startAutoplay() {
    this.interval = setInterval(this.next.bind(this), this.props.timer);
  }

  /**
   * @api
   */
  stopAutoplay() {
    clearInterval(this.interval);
  }

  render() {
    const { children, slidesToScroll, loopAround, autoplay, timer, resetOnInteraction, ...props } = this.props;

    return <div {...props}>{Children.map(children, c => cloneElement(c, {
      currentSlide: this.state.current,
      numSlides:    this.state.numSlides,
      maxSlideRect: this.state.slideRect,
    }))}</div>;
  }
}
