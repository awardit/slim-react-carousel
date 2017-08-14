import React, { Component } from 'react';
import PropTypes from "prop-types";

import { CAROUSEL_CTX } from "./Carousel";

export class Arrows extends Component {
  static contextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  };

  componentWillMount() {
    if( ! this.context[CAROUSEL_CTX] && process.env.NODE_ENV !== "production") {
      console.error("<Arrows /> must be nested inside of a <Carousel />")
    }
  }

  render() {
    return (
      <div>
        <button onClick={() => this.context[CAROUSEL_CTX].prev()}>prev</button>
        <button onClick={() => this.context[CAROUSEL_CTX].next()}>next</button>
      </div>
    );
  }
}

export class Dots extends Component {
  static contextTypes = {
    [CAROUSEL_CTX]: PropTypes.object
  };

  componentWillMount() {
    if( ! this.context[CAROUSEL_CTX] && process.env.NODE_ENV !== "production") {
      console.error("<Arrows /> must be nested inside of a <Carousel />")
    }
  }

  render() {
    const { numPages, slidesToScroll, currentPage, maxSlideRect, ...props } = this.props;
    console.log(numPages);

    return (
      <div {...props}>
        {Array.from({length: numPages }, (v, k) => k).map(x =>
          <button
            key={x}
            className={currentPage === x ? 'carousel__dot carousel__dot--active' : 'carousel__dot'}
            onClick={() => this.context[CAROUSEL_CTX].setCurrent(x * slidesToScroll)}
          >
          </button>
        )}
      </div>
    );
  }
}
