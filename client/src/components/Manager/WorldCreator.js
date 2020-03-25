import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import IntegratedElement from 'components/Element/Element';
import Input from 'components/Element/Input';
import Button from 'components/Element/Button';
import p5 from 'p5';
import Map from 'components/Map/Map';
import { lzw_encode } from 'utils/lzw/lzw';

const Wrapper = styled.div`
  display: flex!important;
  flex-direction: column;
  width: 525px;
  height: 605px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  background: #333333;
  padding: 12.5px;
  align-items: center;
`;

const InputsGroup = styled.div`
  display: flex;
`;

const StyledInput = styled(Input)`
  position: initial;
  color: #fff;
  margin: 0 25px;
`;

const GenerateButton = styled(Button)`
  position: initial;
  color: #fff;
  width: 250px;
  margin: 15px 0;
`;

const CreateButton = styled(Button)`
  position: initial;
  color: #fff;
  width: 250px;
  margin: 15px 0;
`;

const Canvas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WCWindow = React.forwardRef((props, ref) => (
  <Wrapper ref={el => ref.current.main = new IntegratedElement(el)}>
    <InputsGroup>
      <StyledInput 
        ref={el => ref.current.name = new IntegratedElement(el, false)} 
        placeholder="Name" 
      />
      <StyledInput 
        ref={el => ref.current.seed = new IntegratedElement(el, false)} 
        placeholder="Seed" 
      />
    </InputsGroup>
    <GenerateButton 
      ref={el => ref.current.generate = new IntegratedElement(el, false)}
    >
      Generate a preview
    </GenerateButton>
    <Canvas 
      ref={el => ref.current.display = new IntegratedElement(el, false)} 
    />
    <CreateButton 
      ref={el => ref.current.submit = new IntegratedElement(el, false)}
    >
      Create
    </CreateButton>
  </Wrapper>
));

const DEFAULT_CONFIG = {};

class WorldCreator extends Window {
  constructor(p, ref, keyboard, map) {
    super(p, ref);
    this.keyboard = keyboard;
    this.map = map;
    this.configurate(DEFAULT_CONFIG);

    this.data = {};

    this.ref.current.generate
      .on('click', () => this.generatePreview());

    this.ref.current.submit
      .on('click', () => {
        this.data.name = this.ref.current.name.value.trim()
        if (this.data.name) {
          if (!this.data.seed || !this.data.map || typeof this.data.map === 'string') {
            this.data.seed = isNaN(this.ref.current.seed.value) ? this.ref.current.seed.value.trim() : Number(this.ref.current.seed.value);
            if (this.data.seed) {
              this.data.map = this.map.generate({ seed: this.data.seed, returnOnly: true })[0];
              this.data.spawnpoint = this.map.spawnpoint;
            }
          }
          if (this.data.seed) {
            this.data.size = [this.data.map.length, this.data.map[0].length];
            const flat = [];
            this.data.map.forEach(values => flat.push(...values));
            const u8 = new Uint8Array(flat);
            const decoder = new TextDecoder('utf8');
            this.data.map = lzw_encode(btoa(decoder.decode(u8)));

            console.log(this.data);
          }
        }
      })
  }

  onOpen() {
    this.keyboard.unlocked = false;
    this.ref.current.seed.value = Math.floor(this.p.random(1, 99999));
    setTimeout(() => this.generatePreview(), 100);
  }

  onClose() {
    this.keyboard.unlocked = true;
  }

  generatePreview() {
    this.data.seed = isNaN(this.ref.current.seed.value) ? this.ref.current.seed.value.trim() : Number(this.ref.current.seed.value);
    if (this.data.seed) {
      if (this.preview) this.preview.canvas.remove();
      this.preview = new p5(p => {

        const map = new Map(p);
        let preview;

        p.setup = () => {
          p.createCanvas(500, 500);
          map.configurate({ size: 1 });
          map.generate({ seed: this.data.seed });
          this.data.map = map.map;
          this.data.spawnpoint = map.spawnpoint;
          map.draw({ pos: { x: p.width/2, y: p.height/2 } });
          preview = p.get(0, 0, p.width, p.height);
        };

        p.draw = () => {
          p.image(preview, 0, 0);
          p.noStroke();
          p.fill(p.color('#00ff80'));
          p.ellipse(p.mouseX, p.mouseY, 5);
          p.ellipse(map.spawnpoint.x, map.spawnpoint.y, 5 + (p.sin(p.frameCount/p.TWO_PI) + 1) * 2)
        };

        p.mousePressed = () => {
          const x = Math.round(p.mouseX);
          const y = Math.round(p.mouseY);
          if (map.isSpawnable(x, y)) {
            map.spawnpoint = { x, y };
            this.data.spawnpoint = map.spawnpoint;
          }
        }
        
      }, this.ref.current.display.element);
    }
  }
}
  
export default WorldCreator;