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
    limitScrollIndex   : PropTypes.bool,
  };

  static defaultProps = {
    timer              : 2000,
    slidesToScroll     : 1,
    loopAround         : false,
    autoplay           : false,
    resetOnInteraction : true,
    limitScrollIndex   : true,
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
    const { limitScrollIndex, resetOnInteraction, slidesToScroll } = this.props;
    const { current, numSlides } = this.state;

    const index    = (current + diff) % numSlides;
    // Adjust for negative indexes, if we are limiting to pages we need to add one to adjust for rounding
    const absolute = index < 0 ? numSlides + index + (limitScrollIndex|0) - ((slidesToScroll === 1) ? 1 : 0) : index;
    const adjusted = limitScrollIndex ? (absolute / slidesToScroll | 0) * slidesToScroll : absolute;

    this.setState({
      current: adjusted
    });

    if(resetOnInteraction) {
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
    const { loopAround, slidesToScroll } = this.props;
    const { current, numSlides } = this.state;

    if(loopAround) {
      this.modifyCurrent(slidesToScroll);
    }
    // Makes no sense to try to scroll
    else if(current + slidesToScroll < numSlides) {
      this.setCurrent(current + slidesToScroll);
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
    const { children, slidesToScroll, loopAround, autoplay, timer, resetOnInteraction, limitScrollIndex, ...props } = this.props;

    return <div {...props}>{Children.map(children, c => cloneElement(c, {
      currentSlide:   this.state.current,
      currentPage:    Math.ceil(this.state.current / this.props.slidesToScroll),
      numSlides:      this.state.numSlides,
      numPages:       Math.ceil(this.state.numSlides / this.props.slidesToScroll),
      maxSlideRect:   this.state.slideRect,
      slidesToScroll: this.props.slidesToScroll,
    }))}</div>;
  }
}
