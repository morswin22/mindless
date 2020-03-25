class Manager {
  constructor() {
    this.windows = [];
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
}

export default Manager;