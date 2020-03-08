import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize, draw } from 'atomic/utils';
import Input, { IntegratedInput } from 'components/Input/Input';
import { useAuthorization } from 'components/User/User';
import Grid from 'components/Grid/Grid';

const GridIntegration = () => {
  const { loading, user } = useAuthorization(user => user);
  const input = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={input} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);
        const cli = new Console(p, keyboard, new IntegratedInput(input.current));

        const grid = new Grid(p);
            
        p.setup = () => {
          p.createCanvas(500, 500);
          p.windowResized();
        }
      
        p.draw = () => {
          p.background(255);
      
          draw(grid, cli);
        }

        p.windowResized = () => resize(cli, grid);
      }) }
    </>
  ): null;
}

export default GridIntegration;