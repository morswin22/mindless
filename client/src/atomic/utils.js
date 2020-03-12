import React from 'react';
import P5Wrapper from 'react-p5-wrapper';

export const makeSketch = sketch => <P5Wrapper sketch={sketch} />;
export const resize = function() { for (let arg of arguments) if (arg.resize) arg.resize() };
export const draw = camera => function() { for (let arg of arguments) if (arg.draw) arg.draw(camera) };
export const update = function() { for (let arg of arguments) if (arg.update) arg.update() };