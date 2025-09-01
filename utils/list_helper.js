const _ = require('lodash')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const result = blogs.reduce((sum, blog) => sum + blog.likes || 0, 0)
    return result
}

const favoriteBlog = (blogs) => {
    if (!Array.isArray(blogs) || blogs.length == 0)
        return null

    const foundBlog = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
    const result = {
        title: foundBlog.title,
        author: foundBlog.author,
        likes: foundBlog.likes
    }
    return result
}

const mostBlog = (blogs) => {
    const quantityAuthors = _.countBy(blogs, 'author')
    const authorsArray = Object.entries(quantityAuthors).map(([author, blogs]) => ({
        author,
        blogs
    }))
    const mostBlogsByAuthor = _.maxBy(authorsArray, 'blogs')
    return mostBlogsByAuthor;
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const likesByAuthor = Object.entries(groupedByAuthor).map(([author, post]) => {
        const totalLikes = _.sumBy(post, 'likes')
        return { author, likes: totalLikes }
    })
    const mostLikedAuthor = _.maxBy(likesByAuthor, 'likes')
    return mostLikedAuthor
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const initializeUser = async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'roto', password: passwordHash })

    await user.save()
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlog,
    mostLikes,
    usersInDb,
    initializeUser
}