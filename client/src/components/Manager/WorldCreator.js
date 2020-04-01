import React from 'react';
import styled from 'styled-components';
import Window from './Window';
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

const DEFAULT_CONFIG = {
  request: ['keyboard', 'map']
};

class WorldCreator extends Window {
  constructor() {
    super();
    this.configurate(DEFAULT_CONFIG);

    this.data = {};

    this.Component = ({ set }) => (
      <Wrapper ref={ set('main') }>
        <InputsGroup>
          <StyledInput ref={ set('name') } placeholder="Name" />
          <StyledInput ref={ set('seed') } placeholder="Seed" />
        </InputsGroup>
        <GenerateButton ref={ set('generate') }>
          Generate a preview
        </GenerateButton>
        <Canvas ref={ set('display') } />
        <CreateButton ref={ set('submit') }>
          Create
        </CreateButton>
      </Wrapper>
    );
  }

  onSupply() {
    this.ref.get('generate')
      .on('click', () => this.generatePreview());

    this.ref.get('submit')
      .on('click', () => {
        this.data.name = this.ref.get('name').value.trim()
        if (this.data.name) {
          if (!this.data.seed || !this.data.map || typeof this.data.map === 'string') {
            this.data.seed = isNaN(this.ref.get('seed').value) ? this.ref.get('seed').value.trim() : Number(this.ref.get('seed').value);
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
    this.keyboard.lock(this.constructor.name);
    this.ref.get('seed').value = Math.floor(Math.random() * 99999);
    setTimeout(() => this.generatePreview(), 100);
  }

  onClose() {
    this.keyboard.unlock(this.constructor.name);
  }

  generatePreview() {
    this.data.seed = isNaN(this.ref.get('seed').value) ? this.ref.get('seed').value.trim() : Number(this.ref.get('seed').value);
    if (this.data.seed) {
      if (this.preview) this.preview.canvas.remove();
      this.preview = new p5(p => {

        const map = new Map(p);
        let preview;

        p.setup = () => {
          p.createCanvas(500, 500);
          p.fill('#ffffff');
          map.configurate({ size: 1 });
          map.generate({ seed: this.data.seed, preview: true })
            .then(() => {
              [this.data.map, this.data.spawnpoint] = [map.map, map.spawnpoint];
              map.drawPreview();
            })
        };

        p.draw = () => {
          if (preview) {
            p.image(preview, 0, 0);
            p.noStroke();
            p.fill('#00ff80');
            p.ellipse(p.mouseX, p.mouseY, 5);
            p.ellipse(map.spawnpoint.x, map.spawnpoint.y, 5 + (p.sin(p.frameCount/p.TWO_PI) + 1) * 2)
          } else if (map.previewData) {
            if (map.preview()) preview = p.get(0, 0, p.width, p.height);
          } else {
            p.clear();
            p.textAlign(p.CENTER, p.CENTER);
            p.text('Loading', 0, 0, p.width, p.height);
          }
        };

        p.mousePressed = () => {
          const x = Math.round(p.mouseX);
          const y = Math.round(p.mouseY);
          if (map.isSpawnable(x, y)) {
            this.data.spawnpoint = map.spawnpoint = { x, y };
          }
        }
        
      }, this.ref.get('display').element);
    }
  }
}
  
export default WorldCreator;