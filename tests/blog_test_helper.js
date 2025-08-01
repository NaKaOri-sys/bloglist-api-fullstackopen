const Blog = require('../models/blog')
const initialBlog = [
  {
    title: "River campeón",
    author: "Marcelo Daniel Gallardo",
    url: "www.river.com.ar",
    likes: 912
},
  {
    title: "Hp PC",
    author: "Alguien random",
    url: "www.qweqwe.com.ar",
    likes: 12
},
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlog, blogsInDb
}