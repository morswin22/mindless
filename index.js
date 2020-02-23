require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const http = require("http")
const https = require("https")
const path = require("path")
const cookie = require('cookie');
const { User } = require('./models');

const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");

const configurations = {
  development: { hostname: 'localhost', port: 5000, ssl: false, db: "mongodb://localhost:27017/mindless" },
  production: { hostname: 'localhost', port: 80, ssl: false, db: "mongodb://localhost:27017/mindless" },
}

const environment = process.env.NODE_ENV || "production"
const config = configurations[environment]

mongoose
  .connect(config.db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log(`MongoDB is connected on ${config.db}`))
  .catch(error => console.error(error))

const app = express()
app.use(bodyParser.json());
app.use(session);

app.use(express.static(path.join(__dirname, "public/")))
app.use("/js/", express.static(path.join(__dirname, "build/")))

let server
if (config.ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
    },
    app
  )
} else {
  server = http.createServer(app)
}

server.listen({ port: config.port }, () => {
  console.log(
    "Server ready at",
    `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}/`
  )
})

const io = require('socket.io')(server)
io.use(sharedsession(session, {
  autoSave:true
})); 

io.engine.generateId = req =>  {
  const cookies = cookie.parse(req.headers.cookie);
  // this doesn't preserve session id
  return cookies.io && cookies.io !== 'undefined' ? cookies.io : Math.floor(Math.random()*1000);
}

io.on('connection', socket => {
  socket.on('getSession', callback => {
    console.log(socket.handshake.session.id);
    if (socket.handshake.session.user) {
      const { name, password } = socket.handshake.session.user;
      User.findOne({ name: name }).exec((err, user) => {
        (!err && user && user.password === password) ? callback({ user, timestamp: Date.now()}) : callback({ user: null })
      })
    } else {
      callback({ user: null });
    }
  })
  socket.on('login', ({ name, password }, callback) => {
    User.findOne({ name: name }).exec((err, user) => {
      if (!err && user && user.password === password) {
        socket.handshake.session.user = user;
        console.log(socket.handshake.session.id);
        callback({ user, timestamp: Date.now()});
      } else {
        callback({ error: 'Bad login credentails' });
      } 
    })
  })
  socket.on('save', (user, callback) => {
    User.updateOne({_id: user._id}, { ...user }).exec(err => {
      !err ? callback({ user, timestamp: Date.now()}) : callback({ error: 'Couldn\'t update user' })
    })
  })
});