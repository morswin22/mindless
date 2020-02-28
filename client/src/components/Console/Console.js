const DEFAULT_CONFIG = {
  key: '`',
  paddingTop: 8,
  paddingSide: 8,
  height: 22,
  background: '#333',
  color: '#fff',
}

class Console {
  constructor(p) {
    this.p = p;
    this.config = { ...DEFAULT_CONFIG };
  }

  configurate(config) {
    this.config = { ...this.config, ...config };
  }

  draw() {
    this.p.rectMode(this.p.CORNERS);
    this.p.noStroke();
    this.p.fill(this.p.color(this.config.background));
    this.p.rect(this.config.paddingSide, this.config.paddingTop, this.p.width-this.config.paddingSide, this.config.paddingTop + this.config.height);
    this.p.fill(this.p.color(this.config.color));

  }
}

export default Console;