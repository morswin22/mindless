import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize, draw, update } from 'atomic/utils';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import { useAuthorization } from 'components/User/User';
import Map from 'components/Map/Map';
import Player from 'components/Player/Player';
import Manager from 'components/Manager/Manager';
import WorldCreator, { WCWindow } from 'components/Manager/WorldCreator';
import MainMenu, { MMWindow } from 'components/Manager/MainMenu';

const MainMenuIntegration = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const consoleInput = useRef(null);
  const WCRef = useRef({});
  const MMRef = useRef({});

  return !loading && user ? (
    <>
      <Input ref={consoleInput} />
      <WCWindow ref={WCRef} />
      <MMWindow ref={MMRef} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        const player = new Player(p, keyboard);
        player.pos.set(5050, 4150);

        const map = new Map(p);

        const manager = new Manager();
        const worldCreator = manager.add(new WorldCreator(p, WCRef, keyboard, map));
        const mainMenu = manager.add(new MainMenu(p, MMRef, keyboard, logout));

        window.manager = manager;

        const cli = new Console(p, keyboard, new IntegratedElement(consoleInput.current), {
          "logout": logout,
          "tp": (x, y) => player.pos.set(Number(x), Number(y)),
          "create": () => setTimeout(worldCreator.show, 0),
        });
            
        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.windowResized();
          mainMenu.show();
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

export default MainMenuIntegration;