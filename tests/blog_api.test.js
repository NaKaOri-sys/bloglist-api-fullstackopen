const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlog[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlog[1])
  await blogObject.save()
})

test('blog list are equals than db', async () => {
  const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
  console.log(response.body.length);

  assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "WOLOLO PC",
    author: "Some random",
    url: "www.qweqwe.com.ar",
    likes: 14
  }
  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const title = response.body.map(b => b.title)

  assert.strictEqual(response.body.length, helper.initialBlog.length +1)
  assert(title.includes(newBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})