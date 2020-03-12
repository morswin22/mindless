const DEFAULT_CONFIG = {
  size: 20,
  mass: 3,
  friction: 0.5,
  display: {
    type: 'standard',
    stroke: '#515151',
    fill: '#878787'
  }
};

class Entity {
  constructor(p) {
    this.p = p;
    this.config = {};
    this.configurate(DEFAULT_CONFIG);
    
    this.pos = p.createVector(0, 0);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
  }

  configurate(config) {
    this.config = { ...this.config, ...config };
  }

  applyForce(x, y) { // maybe change for p5.Vector ?
    this.acc.add(x / this.config.mass, y / this.config.mass);
  }

  update() {
    const friction = this.vel.copy();
    friction.mult(-1);
    // friction.normalize();
    friction.mult(this.config.friction);
    this.applyForce(friction.x, friction.y);

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  draw(camera) {
    this[this.config.display.type + 'Draw'](camera);
  }

  standardDraw() {
    if (this.config.display.stroke) {
      this.p.stroke(this.p.color(this.config.display.stroke));
    } else {
      this.p.noStroke();
    }

    if (this.config.display.fill) {
      this.p.fill(this.p.color(this.config.display.fill));
    } else {
      this.p.noFill();
    }

    this.p.ellipse(this.pos.x, this.pos.y, this.config.size);
  }
}

export default Entity;