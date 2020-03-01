class Keyboard {
  constructor(p) {
    this.keyboard = {};
    this.listeners = {
      press: [],
      release: []
    };
    p.keyPressed = () => {
      this.emit('press', p.key);
    };
    p.keyReleased = () => {
      this.emit('release', p.key);
    };
  }

  on(event, callback) {
    return this.listeners[event].push(callback);
  }

  off(event, listener) {
    this.listeners[event][listener] = null;
  }

  emit(event, key) {
    for (const listener of this.listeners[event]) {
      if (listener) listener(key);
    }
    if (event === 'press') {
      this.keyboard[key] = true;
    } else if (event === 'release') {
      this.keyboard[key] = false;
    }
  }
}

export default Keyboard;