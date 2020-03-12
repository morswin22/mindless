import Entity from "components/Entity/Entity";
const DEFAULT_CONFIG = {
  display: {
    type: 'standard',
    stroke: '#333333',
    fill: '#0080ff'
  },
  keys: {
    up: 'w',
    left: 'a',
    down: 's',
    right: 'd',
  },
  speed: 1.2,
}

class Player extends Entity {
  constructor(p, keyboard) {
    super(p);
    this.keyboard = keyboard;
    this.configurate(DEFAULT_CONFIG);
  }

  update() {
    if (this.keyboard.pressed(this.config.keys.up)) {
      this.applyForce(0, -this.config.speed)
    }
    if (this.keyboard.pressed(this.config.keys.down)) {
      this.applyForce(0, this.config.speed)
    }
    if (this.keyboard.pressed(this.config.keys.left)) {
      this.applyForce(-this.config.speed, 0)
    }
    if (this.keyboard.pressed(this.config.keys.right)) {
      this.applyForce(this.config.speed, 0)
    }

    super.update();
  }
}

export default Player;