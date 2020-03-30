const DEFAULT_CONFIG = {
  size: 100,
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
    this.resize();
  }

  resize() {
    this.n = Math.floor(this.p.width / this.config.size) + 1;
    this.m = Math.floor(this.p.height / this.config.size) + 1;
  }

  draw(camera) {
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
    
    const x = camera.pos.x - this.p.width/2;
    const y = camera.pos.y - this.p.height/2;

    for (let i = 0; i <= this.n; i++) {
      this.p.line(i*this.config.size + x - x % this.config.size, y, i*this.config.size + x - x % this.config.size, camera.pos.y + this.p.height/2);
    }

    for (let j = 0; j <= this.m; j++) {
      this.p.line(x, j*this.config.size + y - y % this.config.size, camera.pos.x + this.p.width/2, j*this.config.size + y - y % this.config.size);
    }
  }
}

export default Grid;