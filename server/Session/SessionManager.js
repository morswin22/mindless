const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

class SessionManager {
  constructor(config) {
    config = config || {};
    this.saveFile = config.saveFile || '.session';
    this.lifetime = config.lifetime || 1000 * 60 * 45 * 1;

    this.load();
  }

  add() {
    let sid;
    do { sid = uuidv4() } while (this.find(sid));
    const session = { sid, timestamp: Date.now() };
    this.sessions.push(session);
    return session;
  }

  find(sid) {
    if (!sid) return undefined;
    for (let session of this.sessions) {
      if (session.sid === sid) {
        return (Date.now() - session.timestamp > this.lifetime) ? undefined : session;
      }
    }
    return undefined;
  }

  get(sid) {
    const session = this.find(sid) || this.add();
    return session;
  }

  save(session) {
    session.timestamp = Date.now();
    this.sessions = this.sessions.filter(session => Date.now() - session.timestamp <= this.lifetime);
    fs.writeFileSync(this.saveFile, JSON.stringify(this.sessions));
  }

  load() {
    if (!fs.existsSync(this.saveFile)) fs.writeFileSync(this.saveFile, JSON.stringify([]))
    this.sessions = JSON.parse(fs.readFileSync(this.saveFile));
  }
}

module.exports = SessionManager;