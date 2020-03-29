import React from 'react';
import IntegratedElement from 'components/Element/Element';

class Manager {
  constructor() {
    this.windows = [];
    this.ref = React.createRef(null);
    this.ref.current = {
      set: (parent, name, element) => {
        if (!this.ref.current[parent]) this.ref.current[parent] = {};
        this.ref.current[parent][name] = new IntegratedElement(element, name === 'main');
      },
      get: (parent, name) => {
        return this.ref.current[parent] ? this.ref.current[parent][name] : undefined;
      }
    };
  }

  add(window) {
    const wid = this.windows.push(window) - 1;
    window.show = () => this.show(wid);
    window.hide = () => this.hide(wid);
    return window;
  }

  show(wid) {
    if (this.windows[wid]) this.windows[wid].isOpen = true;
  }

  hide(wid) {
    if (this.windows[wid]) this.windows[wid].isOpen = false;
  }

  render() {
    return this.windows.map((window, wid) => (
      <window.Render ref={this.ref} key={wid} />
    ));
  }

  supply(supplies) {
    for (const window of this.windows) {
      const gathered = {};
      for (const requested of window.config.request) {
        if (supplies[requested]) {
          gathered[requested] = supplies[requested];
        } else {
          console.error('Manager cannot supply', window, 'with', requested);
        }
      }
      window.supply(gathered);
    }
  }
}

export default Manager;