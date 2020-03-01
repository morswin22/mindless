import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import makeSketch from 'atomic/makeSketch';
import Input from 'components/Input/Input';

const ConsoleIntegration = () => {
  const input = useRef(null);

  return (
    <>
      <Input ref={input} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);
        const cli = new Console(p, keyboard, input.current);
      
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
  )
} 

export default ConsoleIntegration;