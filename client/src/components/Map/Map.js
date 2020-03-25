import Grid from "components/Grid/Grid";
import mapGenerate, { DEFAULT_TYPES } from "./Generate";

const DEFAULT_CONFIG = {
  displays: {
    [DEFAULT_TYPES.ocean]: [5,72,174],
    [DEFAULT_TYPES.water]: [36,201,188],
    [DEFAULT_TYPES.sand]: [236,203,161],
    [DEFAULT_TYPES.grass]: [49,122,55],
    [DEFAULT_TYPES.stone]: [143,155,156],
    [DEFAULT_TYPES.dirt]: [76,69,59],
    [DEFAULT_TYPES.forest]: [22,77,36],
    [DEFAULT_TYPES.temple]: [255,0,255],
  }
};

class Map extends Grid {
  constructor(p) {
    super(p);
    this.configurate(DEFAULT_CONFIG);
  }

  generate(config) {
    if (config && config.returnOnly) return mapGenerate(this.p, config || {});

    [this.map, this.mapSeed, this.spawnpoint] = mapGenerate(this.p, config || {});
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

  isSpawnable(x, y) {
    return this.map && this.mapConstrains && !(x < this.mapConstrains.x.min || y < this.mapConstrains.y.min || x >= this.mapConstrains.x.max || y >= this.mapConstrains.y.max) && this.map[x][y] === DEFAULT_TYPES.grass;
  }

  draw(camera) {
    super.draw(camera);

    if (this.map) {
      this.p.noStroke();
      this.p.rectMode(this.p.CORNER);
  
      const x = Math.floor(camera.pos.x / this.config.size) - (this.m)/2;
      const y = Math.floor(camera.pos.y / this.config.size) - (this.n)/2;

      for (let i = Math.max(x, this.mapConstrains.x.min); i < Math.min(this.m + x + 1, this.mapConstrains.x.max); i++) {
        for (let j = Math.max(y, this.mapConstrains.y.min); j < Math.min(this.n + y + 1, this.mapConstrains.y.max); j++) {
          this.p.fill(this.p.color(...this.config.displays[this.map[i][j]]));
          this.p.rect(i*this.config.size, j*this.config.size, this.config.size + 1, this.config.size + 1);
        }
      }
    }
  }
}

export default Map;