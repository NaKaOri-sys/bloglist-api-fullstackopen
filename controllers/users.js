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

module.exports = usersRouter