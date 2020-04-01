import React, { useRef } from 'react';
import Console from 'components/Console/Console';
import Keyboard from 'components/Keyboard/Keyboard';
import { makeSketch, resize } from 'atomic/utils';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import { useAuthorization } from 'components/User/User';

const FilterIntegration = () => {
  const { loading, user, logout } = useAuthorization(user => user);
  const consoleInput = useRef(null);

  return !loading && user ? (
    <>
      <Input ref={consoleInput} />
      { makeSketch(p => {  
        const keyboard = new Keyboard(p);

        let inputing = 0;

        const cli = new Console(p, keyboard, new IntegratedElement(consoleInput.current), {
          "logout": logout,
          "toggle": () => inputing = Number(!inputing)
        });

        const table = Array(9).fill(-1);
        const getAt = (x, y) => table[y * 3 + x] !== -1;
        const getAt2 = (x, y) => table[y * 3 + x] === 1;
            
        p.setup = () => {
          p.createCanvas(300, 300);
          p.windowResized();
          // p.frameRate(1);
        }
      
        p.draw = () => {
          // update

          // console.time('morphing');

          const morphed = {
            n: 0, 
            d: 0, 
            nCorners: Array(4).fill(false),
            dCorners: Array(4).fill(false),
            m: 0,
            d2: 0,
            mCorners: Array(4).fill(false),
          };

          // THIS CHECKS FOR SAME TYPE

          if (getAt(0,0)) { // top left
            morphed.nCorners[0] = true;
            morphed.dCorners[0] = true;
          }
          if (getAt(1,0)) { // top middle
            morphed.nCorners[0] = true;
            morphed.nCorners[1] = true;
          }
          if (getAt(2,0)) { // top right
            morphed.nCorners[1] = true;
            morphed.dCorners[1] = true;
          }

          if (getAt(0,1)) { // middle left
            morphed.nCorners[0] = true;
            morphed.nCorners[2] = true;
          }
          if (getAt(2,1)) { // middle right
            morphed.nCorners[1] = true;
            morphed.nCorners[3] = true;
          }

          if (getAt(0,2)) { // bottom left
            morphed.nCorners[2] = true;
            morphed.dCorners[2] = true;
          }
          if (getAt(1,2)) { // bottom middle
            morphed.nCorners[2] = true;
            morphed.nCorners[3] = true;
          }
          if (getAt(2,2)) { // bottom right
            morphed.nCorners[3] = true;
            morphed.dCorners[3] = true;
          }

          morphed.n = 4 - morphed.nCorners.reduce((acc, val) => acc + Number(val), 0);

          switch(morphed.n) {
            case 1:
              if ((morphed.dCorners[0] || getAt(1,0) || getAt(0,1)) && (getAt(1,0) || morphed.dCorners[1]) && (getAt(0,1) || morphed.dCorners[2])) { // top left
                morphed.d = 0;
              } else if ((morphed.dCorners[1] || getAt(1,0) || getAt(2,1)) && (morphed.dCorners[0] || getAt(1,0)) && (getAt(2,1) || morphed.dCorners[3])) { // top right
                morphed.d = 1;
              } else if ((morphed.dCorners[2] || getAt(0,1) || getAt(1,2)) && (getAt(0,1) || morphed.dCorners[0]) && (getAt(1,2) || morphed.dCorners[3])) { // bottom left
                morphed.d = 2;
              } else if ((morphed.dCorners[3] || getAt(2,1) || getAt(1,2)) && (getAt(2,1) || morphed.dCorners[1]) && (getAt(1,2) || morphed.dCorners[2])) { // bottom right
                morphed.d = 3;
              }
              break;
            case 2:
              if (morphed.dCorners.indexOf(true) === -1) { // 1 on side
                if (getAt(1,0)) {
                  morphed.d = 0;
                } else if (getAt(1,2)) {
                  morphed.d = 3;
                } else if (getAt(0,1)) {
                  morphed.d = 1;
                } else if (getAt(2,1)) {
                  morphed.d = 2;
                }
              } else { // 2 on corners
                const bars = {
                  top: Number(getAt(0,0)) + Number(getAt(1,0)) + Number(getAt(2,0)),
                  bottom: Number(getAt(0,2)) + Number(getAt(1,2)) + Number(getAt(2,2)),
                  left: Number(getAt(0,0)) + Number(getAt(0,1)) + Number(getAt(0,2)),
                  right: Number(getAt(2,0)) + Number(getAt(2,1)) + Number(getAt(2,2)),
                };
                if (bars.top > 1 && bars.left <= 1 && bars.right <= 1) { // top bar
                  morphed.d = 0;
                } else if (bars.bottom > 1 && bars.left <= 1 && bars.right <= 1) { // bottom bar
                  morphed.d = 3;
                } else if (bars.left > 1 && bars.top <= 1 && bars.bottom <= 1) { // bottom bar
                  morphed.d = 1;
                } else if (bars.right > 1 && bars.top <= 1 && bars.bottom <= 1) { // bottom bar
                  morphed.d = 2;
                } else if (getAt(0,0) && getAt(2,2)) { // diagonals top left and down right
                  morphed.d = 4;
                } else if (getAt(0,2) && getAt(2,0)) { // diagonals top right and down left
                  morphed.d = 5;
                }
              }
              break;
            case 3:
              morphed.d = morphed.dCorners.indexOf(true);
              break;
            default:
          }

          // THIS CHECKS FOR TYPE ABOVE

          // need to check only close neighbours
          if (getAt2(1,0) && getAt2(0, 1)) morphed.mCorners[0] = true; // top left
          if (getAt2(1,0) && getAt2(2, 1)) morphed.mCorners[1] = true; // top right
          if (getAt2(1,2) && getAt2(0, 1)) morphed.mCorners[2] = true; // bottom left
          if (getAt2(1,2) && getAt2(2, 1)) morphed.mCorners[3] = true; // bottom right

          morphed.m = morphed.mCorners.reduce((acc, val) => acc + Number(val), 0);

          switch(morphed.m) {
            case 1:
              morphed.d2 = morphed.mCorners.indexOf(true);
              break;
            case 2:
              if (morphed.mCorners[0] && morphed.mCorners[1]) { // top bar
                morphed.d2 = 0;
              } else if (morphed.mCorners[2] && morphed.mCorners[3]) { // bottom bar
                morphed.d2 = 3;
              } else if (morphed.mCorners[0] && morphed.mCorners[2]) { // left bar
                morphed.d2 = 1;
              } else if (morphed.mCorners[1] && morphed.mCorners[3]) { // right bar
                morphed.d2 = 2;
              } else if (morphed.mCorners[0] && morphed.mCorners[3]) { // diagonal top left and bottom right
                morphed.d2 = 4;
              } else if (morphed.mCorners[1] && morphed.mCorners[2]) { // diagonal top right and bottom left
                morphed.d2 = 5;
              }
              break;
            case 3:
              console.error('This should never happen');
              break;
            default:
          }

          // MORPHING COMPLETE
          // console.timeEnd('morphing');

          // draw
          p.background(255);
          p.stroke('#bbb');
          p.line(100, 0, 100, p.height);
          p.line(200, 0, 200, p.height);
          p.line(0, 100, p.width, 100);
          p.line(0, 200, p.width, 200);
          p.noStroke();
          for (const cell in table) {
            const x = cell % 3;
            const y = (cell - x) / 3;
            if (cell === '4') {
              p.fill('green');
            } else if (table[cell] === -1) {
              p.fill('yellow');
            } else if (table[cell] === 0) {
              p.fill('green');
            } else if (table[cell] === 1) {
              p.fill('grey');
            } 
            p.rect(x*100, y*100, 100, 100);
          }
          p.fill('#000');
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`n: ${morphed.n}, d: ${morphed.d}\nm: ${morphed.m}, d2: ${morphed.d2}`,100,100,100,100);
        }

        p.mousePressed = () => {
          const x = Math.floor(p.mouseX / 100);
          const y = Math.floor(p.mouseY / 100);
          const index = y * 3 + x;
          if (table[index] !== undefined) {
            if (table[index] === inputing) {
              table[index] = -1;
            } else {
              table[index] = inputing;
            }
          }
        }

        p.windowResized = () => resize(cli);
      }) }
    </>
  ): null;
}

export default FilterIntegration;