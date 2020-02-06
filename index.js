require("dotenv").config()
const express = require("express")
const http = require("http")
const https = require("https")
const path = require("path")

const configurations = {
  development: { hostname: 'localhost', port: 5000, ssl: false },
  production: { hostname: 'localhost', port: 80, ssl: false },
}

const environment = process.env.NODE_ENV || "production"
const config = configurations[environment]

const app = express()

app.use(express.static(path.join(__dirname, "public/")))
app.use(express.static(path.join(__dirname, "build/")))

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