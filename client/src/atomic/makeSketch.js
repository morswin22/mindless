import React from 'react';
import P5Wrapper from 'react-p5-wrapper';

const makeSketch = sketch => <P5Wrapper sketch={sketch} />;

export default makeSketch;