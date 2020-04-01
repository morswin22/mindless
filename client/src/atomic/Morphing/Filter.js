import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize } from 'atomic/utils';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import { useAuthorization } from 'components/User/User';
import { terrainFilter, TERRAIN_TYPES } from 'components/Map/TerrainMorphing';

const FilterIntegration = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const consoleInput = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={consoleInput} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        let inputing = 'grass';

        const cli = new Console(p, keyboard, new IntegratedElement(consoleInput.current), {
          "logout": logout,
          "toggle": () => inputing = inputing === 'grass' ? 'stone' : 'grass'
        });
            
        const table = Array(5).fill('sand').map(t => Array(5).fill(t));

        const loadedTextures = {};

        p.preload = async () => {
          for (const type in TERRAIN_TYPES) {
            loadedTextures[type] = p.loadImage((await import(`assets/terrain/${type}.png`)).default);
          }
        }

        p.setup = () => {
          p.createCanvas(300, 300);
          p.windowResized();
          p.frameRate(10);
        }
      
        p.draw = () => {
          // update

          // console.time('morphing');
          
          const terrain = Array(3).fill('sand00').map(t => Array(3).fill(t));
          for (let y = 1; y < 4; y++) {
            for (let x = 1; x < 4; x++) {
              terrain[y-1][x-1] = terrainFilter([
                table[y-1][x-1], table[y-1][x], table[y-1][x+1], 
                table[y][x-1], table[y][x], table[y][x+1], 
                table[y+1][x-1], table[y+1][x], table[y+1][x+1], 
              ]);
            }
          }

          // console.timeEnd('morphing');

          // draw
          p.background(255);
          p.stroke('#bbb');
          p.line(100, 0, 100, p.height);
          p.line(200, 0, 200, p.height);
          p.line(0, 100, p.width, 100);
          p.line(0, 200, p.width, 200);
          p.noStroke();

          for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
              for (let texture of terrain[y][x]) {
                // this if should be removed
                if (loadedTextures[texture]) p.image(loadedTextures[texture], x*100, y*100, 100, 100);
              }
            }
          }
        }

        p.mousePressed = () => {
          const x = Math.floor(p.mouseX / 100) + 1;
          const y = Math.floor(p.mouseY / 100) + 1;
          if (table[y][x] !== undefined) {
            if (table[y][x] === inputing) {
              table[y][x] = 'sand';
            } else {
              table[y][x] = inputing;
            }
          }
        }

        p.windowResized = () => resize(cli);
      }) }
    </>
  ): null;
}

export default FilterIntegration;