const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required.'],
    minlength: [3, 'username must be at least 3 characters long.'],
    unique: true
  },
  name: String,
  password: String,
})
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User