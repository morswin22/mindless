import Grid from "components/Grid/Grid";
import mapGenerate from "./Generate";
import { TERRAIN_BASIC_TYPES, TERRAIN_TYPES } from './TerrainMorphing';

const DEFAULT_CONFIG = {
  displays: {
    [TERRAIN_BASIC_TYPES[0]]: [5,72,174],
    [TERRAIN_BASIC_TYPES[1]]: [36,201,188],
    [TERRAIN_BASIC_TYPES[2]]: [236,203,161],
    [TERRAIN_BASIC_TYPES[3]]: [49,122,55],
    [TERRAIN_BASIC_TYPES[4]]: [143,155,156],
    [TERRAIN_BASIC_TYPES[5]]: [76,69,59],
    // [TERRAIN_TYPES.forest]: [22,77,36],
    // [TERRAIN_TYPES.temple]: [255,0,255],
  },
  textures: null,
  batches: 5000,
};

class Map extends Grid {
  constructor(p, textures) {
    super(p);
    this.configurate(DEFAULT_CONFIG);
  }

  generate(config) {
    config = config || {};
    return mapGenerate(this.p, config)
      .then(({ map, mapSeed, spawnpoint }) => {
        if (config.returnOnly) {
          return { map, mapSeed, spawnpoint };
        } else {
          [this.map, this.mapSeed, this.spawnpoint] = [map, mapSeed, spawnpoint];
          this.mapConstrains = {
            x: {
              min: 0,
              max: this.map.length,
            },
            y: {
              min: 0,
              max: this.map[0].length,
            }
          }
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  isSpawnable(x, y) {
    return this.map && this.mapConstrains && !(x < this.mapConstrains.x.min || y < this.mapConstrains.y.min || x >= this.mapConstrains.x.max || y >= this.mapConstrains.y.max) && this.map[x][y] === TERRAIN_TYPES.grass;
  }

  draw(camera) {
    super.draw(camera);

    if (this.map && this.config.textures) {
      this.p.noStroke();
      this.p.rectMode(this.p.CORNER);
  
      const x = Math.floor(camera.pos.x / this.config.size) - Math.floor((this.n)/2);
      const y = Math.floor(camera.pos.y / this.config.size) - Math.floor((this.m)/2);

      const initialI = Math.max(x, this.mapConstrains.x.min);
      const limitI = Math.min(this.n + x + 1, this.mapConstrains.x.max);

      const initialJ = Math.max(y, this.mapConstrains.y.min);
      const limitJ = Math.min(this.m + y + 1, this.mapConstrains.y.max);

      let i = initialI;
      while(i < limitI) {
        let j = initialJ;
        while (j < limitJ) {
          for (const type of this.map[i][j]) {
            this.p.image(this.config.textures[type], i*this.config.size, j*this.config.size, this.config.size + 1, this.config.size + 1);
          }
          j++;
        }
        i++;
      }
      
    }
  }

  drawPreview() {
    this.p.noStroke();
    this.p.rectMode(this.p.CORNER);

    const x = Math.floor((this.p.width / 2 / this.config.size) - (this.m)/2);
    const y = Math.floor((this.p.height / 2 / this.config.size) - (this.n)/2);

    const initialI = Math.max(x, this.mapConstrains.x.min);
    const limitI = Math.min(this.m + x + 1, this.mapConstrains.x.max);

    const initialJ = Math.max(y, this.mapConstrains.y.min);
    const limitJ = Math.min(this.n + y + 1, this.mapConstrains.y.max);

    const total = (limitI - initialI) * (limitJ - initialJ);

    this.previewData = {
      initialI, 
      limitI, 
      lastI: initialI,
      initialJ, 
      limitJ, 
      lastJ: initialJ,
      total,
      totalCounter: 0,
    };
  }

  preview() {
    
    let counter = 0;

    let i = this.previewData.lastI;
    while(i < this.previewData.limitI) {
      let j = this.previewData.lastJ;
      while (j < this.previewData.limitJ) {
        this.p.fill(this.p.color(...this.config.displays[this.map[i][j]]));
        this.p.rect(i*this.config.size, j*this.config.size, this.config.size + 1, this.config.size + 1);
        counter++;
        this.previewData.totalCounter++;
        if (this.previewData.totalCounter === this.previewData.total) {
          return true;
        } else if (counter === this.config.batches) {
          this.previewData.lastI = i;
          this.previewData.lastJ = j;
          return false;
        }
        j++;
      }
      this.previewData.lastJ = this.previewData.initialJ;
      i++;
    }
    this.previewData.lastI = this.previewData.initialI;

  }
}

export default Map;