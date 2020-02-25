import React from 'react';
import { useAuthorization } from 'components/User/User';
import P5Wrapper from 'react-p5-wrapper';

const Game = () => {
  /* const { loading, user } = */ useAuthorization(user => user);

  return <P5Wrapper sketch={(p) => {

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }

    p.draw = () => {
      p.background(51);

      p.noStroke();
      p.fill(255);
      p.rectMode(p.CENTER);
      p.rect(p.width/2, p.height/2, 50, 50);
    }

  }} />;
}

export default Game;