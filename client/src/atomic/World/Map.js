import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize, draw, update } from 'atomic/utils';
import Input, { IntegratedInput } from 'components/Input/Input';
import { useAuthorization } from 'components/User/User';
import Map from 'components/Map/Map';
import Entity from 'components/Entity/Entity';
import Player from 'components/Player/Player';

const MapIntegration = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const input = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={input} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        const blob = new Entity(p);
        blob.pos.set(100, 0);
        const player = new Player(p, keyboard);

        const map = new Map(p);

        const cli = new Console(p, keyboard, new IntegratedInput(input.current), {
          "blob-move": (x, y) => blob.pos.add(Number(x), Number(y)),
          "blob-position": () => console.log(blob.pos.x, blob.pos.y),
          "logout": logout,
          "generate": () => map.generate(),
          "generate-seed": seed => map.generate({ seed: Number(seed) }),
          "tp": (x, y) => player.pos.set(Number(x), Number(y)),
        });
            
        p.setup = () => {
          p.createCanvas(500, 500);
          p.windowResized();
        }
      
        p.draw = () => {
          p.background(255);
          p.translate(p.width/2 - player.pos.x, p.height/2 - player.pos.y);
          update(blob, player);
          draw(player)(map, blob, player, cli);
        }

        p.windowResized = () => resize(cli, map);
      }) }
    </>
  ): null;
}

export default MapIntegration;