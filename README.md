# Slim React Carousel
A small composable carousel using React for rendering.

Demo
===
Coming soon

Install
=======
```
npm install --save slim-react-carousel
```

Usage
=====
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Carousel, Slides, SlideImg, Arrows, Dots } from 'slim-react-carousel';

ReactDOM.render(
  <Carousel>

    <Slides>
      <SlideImg><img src="..." /></SlideImg>
      <SlideImg><img src="..." /></SlideImg>
      <SlideImg><img src="..." /></SlideImg>
    </Slides>

    <Arrows />
    <Dots />

  </Carousel>,
  document.body
);
```

## Components


### Carousel

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">name</th>
      <th style="width: 50px;">type</th>
      <th style="width: 50px;">default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>slidesToScroll</td>
      <td>number</td>
      <td>1</td>
      <td>How many slides to scroll at the same time</td>
    </tr>
    <tr>
      <td>loopAround</td>
      <td>bool</td>
      <td>true</td>
      <td>Loop around when you pass first / last slide</td>
    </tr>
    <tr>
      <td>autoPlay</td>
      <td>bool</td>
      <td>false</td>
      <td>Step through the carousel automatically</td>
    </tr>
    <tr>
      <td>timer</td>
      <td>number</td>
      <td>2000</td>
      <td>Time between each slide when autoPlay is enabled</td>
    </tr>
    <tr>
      <td>resetOnInteraction</td>
      <td>bool</td>
      <td>true</td>
      <td>Padding around each slide</td>
    </tr>
  </tbody>
</table>

### Slides

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">name</th>
      <th style="width: 50px;">type</th>
      <th style="width: 50px;">default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>touchProp</td>
      <td>string</td>
      <td>clientX</td>
      <td>Direction of swipes. "clientX" / "clientY"</td>
    </tr>
    <tr>
      <td>dragThreshold</td>
      <td>number</td>
      <td>80</td>
      <td>How many slides to scroll at the same time</td>
    </tr>
    <tr>
      <td>slidePadding</td>
      <td>number</td>
      <td>0</td>
      <td>Padding around each slide</td>
    </tr>
    <tr>
      <td>slidesToShow</td>
      <td>number</td>
      <td>1</td>
      <td>How many slides to show at the same time</td>
    </tr>
    <tr>
      <td>direction</td>
      <td>string</td>
      <td>"x"</td>
      <td>Direction of the carousel. "x" or "y"</td>
    </tr>
    <tr>
      <td>frameStyles</td>
      <td>object</td>
      <td>{}</td>
      <td>Styling of the frame</td>
    </tr>
    <tr>
      <td>trackStyles</td>
      <td>object</td>
      <td>{}</td>
      <td>Styling of the track</td>
    </tr>
    <tr>
      <td>slideStyles</td>
      <td>object</td>
      <td>{}</td>
      <td>Styling of each slide</td>
    </tr>
  </tbody>
</table>
