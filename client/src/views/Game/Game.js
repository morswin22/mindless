import React, { useRef } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { resize, draw, update } from 'atomic/utils';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import { useAuthorization } from 'components/User/User';
import Grid from 'components/Grid/Grid';
import Entity from 'components/Entity/Entity';
import Player from 'components/Player/Player';

const Game = () => {
  const { loading, user } = useAuthorization(user => user);
  const input = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={input} />
      <P5Wrapper sketch={p => {  
        const keyboard = new Keyboard(p);

        const blob = new Entity(p);
        blob.pos.set(200, 100);
        const player = new Player(p, keyboard);

        const grid = new Grid(p, player);

        const cli = new Console(p, keyboard, new IntegratedElement(input.current));
            
        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.windowResized();
        }
      
        p.draw = () => {
          p.background(255);
          p.translate(p.width/2 - player.pos.x, p.height/2 - player.pos.y);
          update(blob, player);
          draw(player)(grid, blob, player, cli);
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          resize(cli, grid);
        }
      }} />
    </>
  ): null;
};

export default Game;