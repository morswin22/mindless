import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize, draw, update } from 'atomic/utils';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import { useAuthorization } from 'components/User/User';
import Map from 'components/Map/Map';
import Player from 'components/Player/Player';

const MapIntegration = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const consoleInput = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={consoleInput} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        const player = new Player(p, keyboard);
        player.pos.set(5050, 4150);

        const map = new Map(p);

        const cli = new Console(p, keyboard, new IntegratedElement(consoleInput.current), {
          "logout": logout,
          "generate": () => map.generate(),
          "generate-seed": seed => map.generate({ seed: Number(seed) }),
          "tp": (x, y) => player.pos.set(Number(x), Number(y)),
        });
            
        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.windowResized();
        }
      
        p.draw = () => {
          update(player);
          p.background(255);
          p.translate(p.width/2 - player.pos.x, p.height/2 - player.pos.y);
          draw(player)(map, player, cli);
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          resize(cli, map);
        }
      }) }
    </>
  ): null;
}

export default MapIntegration;