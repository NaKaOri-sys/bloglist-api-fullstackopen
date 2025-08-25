const usersRouter = require('express').Router()
const logger = require('../utils/logger')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  let { error, message } = validatePassword(password)
  if (error) {
    response.status(400).json({ error: message })
    return
  }

  const saltRounds = 10
  const passwordHashed = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    password: passwordHashed
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

const validatePassword = (pass) => {
  if (!pass)
    return { error: true, message: 'password is required.' }
  if (pass.length < 3)
    return { error: true, message: 'password must be at least 3 characters long.' }
  return { error: false, message: undefined }
}

module.exports = usersRouter