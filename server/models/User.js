const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  coords: {
    type: [Number],
    required: true,
    default: [0,0]
  }
})

module.exports = {
  User: mongoose.model('User', UserSchema)
}
