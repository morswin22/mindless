const DEFAULT_STATE = { 
  isOpen: false
};

class Window {
  constructor(p, inputs) {
    this.p = p;
    this.config = {
      inputs: {}
    };
    this.state = { ...DEFAULT_STATE };
    this.inputs = inputs || {};
  }

  get isOpen() {
    return this.state.isOpen;
  }

  set isOpen(value) {
    this.state.isOpen = !!value;
    if (this.state.isOpen) {
      for (let input of Object.values(this.inputs)) {
        input.style({ display: 'initial' });
      }
      this.onOpen();
    } else {
      for (let input of Object.values(this.inputs)) {
        input.style({ display: 'none' });
      }
      this.onClose();
    }
  }

  onOpen() {
    // placeholder
  }

  onClose() {
    // placeholder
  }

  configurate(config) {
    this.config = {...this.config, ...config};
    this.resize();
  }

  resize() {
    const bbox = {};
    switch (this.config.display.type) {
      default:
      case 'standard':
        bbox.left = this.config.display.x;
        bbox.right = this.config.display.width - this.config.display.x;
        bbox.top = this.config.display.y;
        bbox.bottom = this.config.display.height - this.config.display.y;
        break;
      case 'standardCenter':
        bbox.left = (this.p.width - this.config.display.width)/2;
        bbox.right = (this.p.width + this.config.display.width)/2;
        bbox.top = (this.p.height - this.config.display.height)/2;
        bbox.bottom = (this.p.height + this.config.display.height)/2;
        break;
    }

    for (let name in this.inputs) {
      if (this.config.inputs[name]) {
        const input = this.inputs[name];
        const styles = {};
        for (const style in this.config.inputs[name]) {
          const value = this.config.inputs[name][style];
          switch (style) {
            default:
            case 'left':
              styles.left = `${bbox.left + value}px`;
              break;
            case 'right':
              styles.right = `${this.p.width - bbox.right + value}px`;
              break;
            case 'top':
              styles.top = `${bbox.top + value}px`;
              break;
            case 'bottom':
              styles.bottom = `${bbox.bottom - value}px`;
              break;
          }
        }
        console.log(bbox.left, this.config.inputs[name]);
        input.style(styles);
      }
    }
  }

  draw(camera) {
    this[this.config.display.type + 'Draw'](camera);
  }

  standardDraw(camera) {
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

    this.p.rectMode(this.p.CORNER);
    this.p.rect(this.config.display.x + camera.pos.x - this.p.width/2, this.config.display.y + camera.pos.y - this.p.height/2, this.config.display.width, this.config.display.height);
  }

  standardCenterDraw(camera) {
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

    this.p.rectMode(this.p.CENTER);
    this.p.rect(camera.pos.x, camera.pos.y, this.config.display.width, this.config.display.height);
  }
}

export default Window;