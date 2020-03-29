const DEFAULT_CONFIG = {
  key: '`',
  paddingTop: 8,
  paddingSide: 8,
  height: 22,
  background: '#333',
  color: '#fff',
};

const DEFAULT_STATE = {
  isOpen: false,
};

const DEFAULT_COMMANDS = {
  hello: name => console.log(`Hello ${ name || 'World!' }`),
}

class Console {
  constructor(p, keyboard, input, commands) {
    this.p = p;
    this.keyboard = keyboard;
    this.input = input
      .on('input', ({ target: { value } }) => {
        this.input.value = value.replace('`','');
      })
      .on('keydown', ({ key }) => {
        if (key === 'Enter') {
          this.evaluate(this.input.value);
          this.state.isOpen = false;
          this.input.value = '';
          this.input.blur();
          this.input.style({ display: 'none' });
          this.keyboard.unlock(this.constructor.name);
        }
      });
    this.config = {};
    this.state = { ...DEFAULT_STATE };
    this.configurate(DEFAULT_CONFIG);
    this.commands = { ...DEFAULT_COMMANDS };
    this.setCommands({ 
      ...commands,
      help: () => console.log(this.commands),
    });
  }

  configurate(config) {
    this.config = { ...this.config, ...config };
    this.input.style({ color: this.config.color });
    this.bind();
    this.resize();
  }

  bind() {
    this.keyboard.on('press', key => {
      if (key === this.config.key) { 
        this.state.isOpen = !this.state.isOpen;
        this.input.value = '';
        if (this.state.isOpen) {
          this.input.style({ display: 'initial' });
          this.input.focus();
          this.keyboard.lock(this.constructor.name)
        } else {
          this.input.blur();
          this.input.style({ display: 'none' });
          this.keyboard.unlock(this.constructor.name)
        }
      }
    });
  }

  resize() {
    this.input.style({
      left: `${this.config.paddingSide}px`,
      top: `${this.config.paddingTop}px`,
      width: `${this.p.width-this.config.paddingSide*2}px`,
      height: `${this.config.height}px`,
    });
  }

  setCommands(commands) {
    this.commands = { ...this.commands, ...commands };
  }

  evaluate(input) {
    const args = input.split(' ');
    const command = this.commands[args.shift()] || (() => console.warn(`Unknown command`));
    command( ...args );
  }

  draw(camera) {
    if (this.state.isOpen) {
      this.p.rectMode(this.p.CORNERS);
      this.p.noStroke();
      this.p.fill(this.p.color(this.config.background));
      this.p.rect(this.config.paddingSide - this.p.width*.5 + camera.pos.x, this.config.paddingTop - this.p.height*.5 + camera.pos.y, this.p.width*.5  + camera.pos.x - this.config.paddingSide, this.config.paddingTop + this.config.height - this.p.height*.5  + camera.pos.y);
    }
  }
}

export default Console;