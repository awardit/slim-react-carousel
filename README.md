# Slim React Carousel
A small composable carousel using React for rendering.

Demo
===
Coming soon

Install
=======
```
npm install --save slim-react-carousel;
```

Usage
=====
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from 'slim-react-carousel';

ReactDOM.render(
  <Carousel>
    <div>slide 1</div>
    <div>slide 2</div>
    <div>slide 3</div>
  </Carousel>,
  document.body
);
```

Props
=====
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
      <td>children</td>
      <td>array</td>
      <td>[]</td>
      <td>React children. Just pass the slides as children</td>
    </tr>
    <tr>
      <td>slidesToShow</td>
      <td>number</td>
      <td>1</td>
      <td>How many slides to show at the same time</td>
    </tr>
    <tr>
      <td>slidesToScroll</td>
      <td>number</td>
      <td>1</td>
      <td>How many slides to scroll at the same time</td>
    </tr>
    <tr>
      <td>swiping</td>
      <td>bool</td>
      <td>true</td>
      <td>Allow swipe controls</td>
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
      <td>slidePadding</td>
      <td>string</td>
      <td>0</td>
      <td>Padding around each slide</td>
    </tr>
    <tr>
      <td>controlType</td>
      <td>string</td>
      <td></td>
      <td>Which control layout to use. Types: `dots`, `nextPrev`</td>
    </tr>
  </tbody>
</table>
