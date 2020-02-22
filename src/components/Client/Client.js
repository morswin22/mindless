const SESSION_TIME = 1000 * 60 * 1;

class Client {
  constructor(socket) {
    this.socket = socket;
    this.data = null;
    setInterval(this.save.bind(this), 1000 * 2);
  }

  login(logger) {
    return new Promise(async (resolve, reject) => {
      const saved = localStorage.getItem('user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < SESSION_TIME) {
          this.data = parsed;
          logger.hide();
          resolve(this.data.user);
        } else {
          localStorage.removeItem('user');
          resolve(this.login(logger));
        }
      } else {
        while (this.data === null) {
          const credentials = await logger.getLogin();
          this.socket.emit('login', credentials, res => {
            if (res.error) {
              reject(res.error);
            } else {
              this.data = res;
              logger.hide();
              resolve(this.data.user)
            }
          });
        }
      }
    })
  }

  save() {
    // POST to DB and save response!
    if (this.data) localStorage.setItem('user', JSON.stringify(this.data));
  }
}

export default Client;