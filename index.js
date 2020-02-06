require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const http = require("http")
const https = require("https")
const path = require("path")
const { User } = require('./models');

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

app.use(express.static(path.join(__dirname, "public/")))
app.use("/js/", express.static(path.join(__dirname, "build/")))

app.post("/login", async ({ body: { name, password } }, res) => {
  const user = await User.findOne({ name }).exec()
  if (user && user.password === password) {
    res.status(200).send({ user, timestamp: Date.now() });
  } else {
    res.sendStatus(403);
  }
})

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