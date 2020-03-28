export default class IntegratedElement {
  constructor(elementRef, hide) {
    this.element = elementRef;
    if (elementRef && (hide === undefined || hide === true)) {
      this.style({ display: 'none!' });
    }
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

  get text() {
    return this.element.innerText;
  }

  set text(val) {
    this.element.text = val;
  }

  style(styles) {
    for (let prop in styles) {
      this.element.style.setProperty(prop, styles[prop].replace('!',''), styles[prop].indexOf('!') === -1 ? undefined : 'important');
    }
  }

  focus() {
    this.element.focus();
  }

  blur() {
    this.element.blur();
  }
};