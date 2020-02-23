class Login {
  constructor(element) {
    this.container = element;
    this.container.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      this.onLoginSubmit(data);
    })
  }

  getLogin() {
    return new Promise((resolve, reject) => {
      this.onLoginSubmit = resolve;
    });
  }

  hide() {
    this.container.classList.add('hidden');
  }

  show() {
    this.container.classList.remove('hidden');
  }
}

export default Login;