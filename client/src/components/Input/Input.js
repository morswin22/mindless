import styled from 'styled-components';

const Input = styled.input`
  position: absolute;
  box-sizing: border-box;
  background-color: transparent;
  border: 0;
  margin: 0;
  padding: 0;
`;

export class IntegratedInput {
  constructor(elementRef) {
    this.element = elementRef;
  }

  on(event, callback) {
    this.element.addEventListener(event, callback);
    return this;
  }

  get value() {
    return this.element.value;
  }

  set value(val) {
    this.element.value = val;
  }

  style(styles) {
    for (let prop in styles) {
      this.element.style[prop] = styles[prop];
    }
  }

  focus() {
    this.element.focus();
  }

  blur() {
    this.element.blur();
  }
}

export default Input;