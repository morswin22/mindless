const DEFAULT_STATE = { 
  isOpen: false
};

class Window {
  constructor(p, ref) {
    this.p = p;
    this.ref = ref;
    this.config = {};
    this.state = { ...DEFAULT_STATE };
  }

  get isOpen() {
    return this.state.isOpen;
  }

  set isOpen(value) {
    this.state.isOpen = !!value;
    if (this.state.isOpen) {
      if (this.ref.current.main) {
        this.ref.current.main.style({ display: 'initial' });
      }
      this.onOpen();
    } else {
      if (this.ref.current.main) {
        this.ref.current.main.style({ display: 'none' });
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
}

export default Window;