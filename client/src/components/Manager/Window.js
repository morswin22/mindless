import React from 'react';

const DEFAULT_STATE = { 
  isOpen: false
};

class Window {
  constructor() {
    this.config = { request: [] };
    this.state = { ...DEFAULT_STATE };

    this.Component = () => null;

    this.Render = React.forwardRef((props, ref) => {
      this.ref = {
        set: name => element => ref.current.set(this.constructor.name, name, element),
        get: name => ref.current.get(this.constructor.name, name),
      }
      return this.Component(this.ref);
    });
  }

  get isOpen() {
    return this.state.isOpen;
  }

  set isOpen(value) {
    this.state.isOpen = !!value;
    if (this.state.isOpen) {
      if (this.ref.get('main')) {
        this.ref.get('main').style({ display: 'initial' });
      }
      this.onOpen();
    } else {
      if (this.ref.get('main')) {
        this.ref.get('main').style({ display: 'none!' });
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
  }

  supply(supplies) {
    for (const supply in supplies) {
      this[supply] = supplies[supply];
    }
    this.onSupply();
  }

  onSupply() {
    // placeholder
  }
}

export default Window;