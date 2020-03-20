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

  resize() {
    this.windows.forEach(window => window.resize());
  }

  draw(camera) {
    this.windows.filter(({ isOpen }) => isOpen).forEach(window => window.draw(camera));
  }
}

export default Manager;