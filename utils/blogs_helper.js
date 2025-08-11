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

const nonExistingId = async () => {
    const blog = new Blog({
        title: "Tralalero tralala",
        author: "Tung tung tun sahur",
        url: "www.argenTina.com.ar",
        likes: 31
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
module.exports = {
    initialBlog, blogsInDb, nonExistingId
}