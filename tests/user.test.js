const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'roto', password: passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation  fails  with proper  statuscode  and  message if  username  is  too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = {
      username: 'ro',  //  menos  de 3  caracteres
      name: 'Shorty',
      password: 'validpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation  fails  if  password is  missing', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = {
      username: 'nopassword',
      name: 'No Pass',
      //  falta  password
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation  fails  if password  is  too  short', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = {
      username: 'shortpass',
      name: 'Tiny Pass',
      password: '12',  //  menos  de 3  caracteres
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('should  fail  when  inserting a  user  with  duplicate username', async () => {
    const duplicatedUser = {
      username: 'root',
      name: 'Second  User',
      password: 'password456'
    }

    await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)
  })

})
after(async () => {
  await mongoose.connection.close()
})