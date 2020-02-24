const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

class SessionManager {
  constructor(config) {
    config = config || {};
    this.saveFile = config.saveFile || '.session';

    this.load();
  }

  add() {
    let sid;
    do { sid = uuidv4() } while (this.find(sid));
    const session = { sid };
    this.sessions.push(session);
    return session;
  }

  find(sid) {
    if (!sid) return undefined;
    for (let session of this.sessions) {
      // check if the session is expired
      if (session.sid === sid) return session;
    }
    return undefined;
  }

  get(sid) {
    return this.find(sid) || this.add();
  }

  save() {
    // unregister all expired sessions
    fs.writeFileSync(this.saveFile, JSON.stringify(this.sessions));
  }

  load() {
    if (!fs.existsSync(this.saveFile)) fs.writeFileSync(this.saveFile, JSON.stringify([]))
    this.sessions = JSON.parse(fs.readFileSync(this.saveFile));
  }
}

module.exports = SessionManager;