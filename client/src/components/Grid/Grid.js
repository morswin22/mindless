const DEFAULT_CONFIG = {
  size: 20,
  stroke: '#ddd',
  fill: null
};

class Grid {
  constructor(p) {
    this.p = p;
    this.config = {};
    this.configurate(DEFAULT_CONFIG);
  }

  configurate(config) {
    this.config = { ...this.config, ...config };
  }

  resize() {
    this.n = Math.floor(this.p.width / this.config.size);
    this.m = Math.floor(this.p.height / this.config.size);
  }

  draw() {
    if (this.config.stroke) {
      this.p.stroke(this.p.color(this.config.stroke));
    } else {
      this.p.noStroke();
    }

    if (this.config.fill) {
      this.p.fill(this.p.color(this.config.fill));
    } else {
      this.p.noFill();
    }
    
    for (let i = 0; i < this.n; i++) {
      this.p.line(i*this.config.size, 0, i*this.config.size, this.p.height);
    }

    for (let j = 0; j < this.m; j++) {
      this.p.line(0, j*this.config.size, this.p.width, j*this.config.size);
    }
  }
}

export default Grid;