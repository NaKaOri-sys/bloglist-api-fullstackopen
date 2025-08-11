const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    response.status(404).json({ error: 'No blog found with the given ID.' })
    return
  }
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    response.status(404).json({ error: 'No blog found with the given ID.' })
    return
  }
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter