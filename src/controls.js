import React from 'react';
import PropTypes from "prop-types";

import CarouselContext from './CarouselContext'

export class Arrows extends React.Component {
  static contextType = CarouselContext;

  componentWillMount() {
    if (!this.context && process.env.NODE_ENV !== "production") {
      console.error("<Arrows /> must be nested inside of a <Carousel />")
    }
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.context.prev()}>prev</button>
        <button onClick={() => this.context.next()}>next</button>
      </React.Fragment>
    );
  }
}

export class Dots extends React.Component {
  static contextType = CarouselContext;

  componentWillMount() {
    if (!this.context && process.env.NODE_ENV !== "production") {
      console.error("<Arrows /> must be nested inside of a <Carousel />")
    }
  }

  render() {
    const { numPages, numSlides, currentSlide, slidesToScroll, currentPage, maxSlideRect, ...props } = this.props;

    return (
      <div {...props}>
        {Array.from({length: numPages }, (v, k) => k).map(x =>
          <button
            key={x}
            className={currentPage === x ? 'carousel__dot carousel__dot--active' : 'carousel__dot'}
            onClick={() => this.context.setCurrent(x * slidesToScroll)}
          >
          </button>
        )}
      </div>
    );
  }
}
