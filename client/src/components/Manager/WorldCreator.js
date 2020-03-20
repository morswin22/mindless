import Window from './Window';

const DEFAULT_CONFIG = {
  inputs: {
    name: {
      left: 20,
      top: 20,
    },
    seed: {
      right: 20,
      top: 20,
    }
  },
  display: {
    type: 'standardCenter',
    width: 525,
    height: 625,
    fill: '#333333',
  },
};

class WorldCreatorWindow extends Window {
  constructor(p, inputs, keyboard, map) {
    super(p, inputs);
    this.keyboard = keyboard;
    [this.nameInput, this.seedInput] = Object.values(inputs);

    this.configurate(DEFAULT_CONFIG);

    this.nameInput
      .on('input', ({ target: { value } }) => {
        this.nameInput.value = value;
      });

    this.seedInput
      .on('input', ({ target: { value } }) => {
        this.seedInput.value = value;
      });
  }

  onOpen() {
    this.keyboard.unlocked = false;
  }

  onClose() {
    this.keyboard.unlocked = true;
  }
}
  
export default WorldCreatorWindow;