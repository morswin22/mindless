import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize, draw, update } from 'atomic/utils';
import Input, { IntegratedInput } from 'components/Input/Input';
import { useAuthorization } from 'components/User/User';
import Map from 'components/Map/Map';
import Player from 'components/Player/Player';
import Manager from 'components/Manager/Manager';
import WorldCreatorWindow from 'components/Manager/WorldCreator';

const WorldCreator = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const consoleInput = useRef(null);
  const nameInput = useRef(null);
  const seedInput = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={consoleInput} />
      <Input ref={nameInput} />
      <Input ref={seedInput} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        const player = new Player(p, keyboard);
        player.pos.set(5050, 4150);

        const map = new Map(p);
        // map.generate(); causes error

        const manager = new Manager();
        const wcw = manager.add(new WorldCreatorWindow(p, {
          name: new IntegratedInput(nameInput.current),
          seed: new IntegratedInput(seedInput.current),
        }, keyboard));

        window.manager = manager;

        const cli = new Console(p, keyboard, new IntegratedInput(consoleInput.current), {
          "logout": logout,
          "tp": (x, y) => player.pos.set(Number(x), Number(y)),
          "create": () => setTimeout(wcw.show, 200),
        });
            
        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.windowResized();
        }
      
        p.draw = () => {
          update(player);
          p.background(255);
          p.translate(p.width/2 - player.pos.x, p.height/2 - player.pos.y);
          draw(player)(map, player, manager, cli);
        }

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          resize(cli, map, manager);
        }
      }) }
    </>
  ): null;
}

export default WorldCreator;