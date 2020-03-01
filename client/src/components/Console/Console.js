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

class Console {
  constructor(p, keyboard, input) {
    this.p = p;
    this.keyboard = keyboard;
    this.input = input;
    this.input.addEventListener('input', ({ target: { value } }) => {
      this.input.value = value.replace('`','');
    });
    this.input.addEventListener('keydown', ({ key }) => {
      if (key === 'Enter') {
        this.evaluate(this.input.value);
        this.state.isOpen = false;
        this.input.value = '';
        this.input.blur();
        this.input.style.display = 'none';
      }
    });
    this.config = {};
    this.state = { ...DEFAULT_STATE };
    this.configurate(DEFAULT_CONFIG);
  }

  configurate(config) {
    this.config = { ...this.config, ...config };
    if (this.input) this.input.style.color = this.config.color;
    this.bind();
    this.resize();
  }

  bind() {
    this.keyboard.on('press', key => {
      if (key === this.config.key) { 
        this.state.isOpen = !this.state.isOpen;
        this.input.value = '';
        if (this.state.isOpen) {
          this.input.style.display = 'initial';
          this.input.focus();
        } else {
          this.input.blur();
          this.input.style.display = 'none';
        }
      }
    });
  }

  resize() {
    if (this.input) {
      this.input.style.left = `${this.config.paddingSide}px`;
      this.input.style.top = `${this.config.paddingTop}px`;
      this.input.style.width = `${this.p.width-this.config.paddingSide*2}px`;
      this.input.style.height = `${this.config.height}px`;
    }
  }

  evaluate(input) {
    const args = input.split(' ');
    const command = args.shift();
    console.log(command, args);
  }

  draw() {
    if (this.state.isOpen) {
      this.p.rectMode(this.p.CORNERS);
      this.p.noStroke();
      this.p.fill(this.p.color(this.config.background));
      this.p.rect(this.config.paddingSide, this.config.paddingTop, this.p.width-this.config.paddingSide, this.config.paddingTop + this.config.height);
    }
  }
}

export default Console;