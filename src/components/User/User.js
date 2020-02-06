const SESSION_TIME = 1000 * 60 * 1;

class User {
  constructor() {
    this.data = null;
    setInterval(this.save.bind(this), 1000 * 2);
  }

  async login(logger) {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Date.now() - parsed.timestamp < SESSION_TIME) {
        this.data = parsed;
        logger.hide();
      } else {
        localStorage.removeItem('user');
        return this.login(logger);
      }
    } else {
      while (this.data === null) {
        const credentials = await logger.getLogin();
        const json = await this.fetch(credentials);
        if (json) {
          this.data = json;
          logger.hide();
        }
      }
    }
  }

  async fetch(user) {
    try {
      return await (await fetch('/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })).json();
    } catch(e) {
      return null;
    }
  }

  save() {
    // POST to DB and save response!
    if (this.data) localStorage.setItem('user', JSON.stringify(this.data));
  }
}

export default User;