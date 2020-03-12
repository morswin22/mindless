import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch } from 'atomic/utils';
import Input, { IntegratedInput } from 'components/Input/Input';
import { useAuthorization } from 'components/User/User';

const ConsoleIntegration = () => {
  const { loading, user } = useAuthorization(user => user);
  const input = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={input} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);
        const cli = new Console(p, keyboard, new IntegratedInput(input.current), {
          user: () => console.log(user.name),
        });
      
        window.cli = cli;
      
        p.setup = () => {
          p.createCanvas(500, 500);
          cli.resize();
        }
      
        p.draw = () => {
          p.background(255);
      
          cli.draw();
        }

        p.windowResized = () => {
          cli.resize();
        }
      }) }
    </>
  ): null;
} 

export default ConsoleIntegration;