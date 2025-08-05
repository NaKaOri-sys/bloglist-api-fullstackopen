const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const result = blogs.reduce((sum, blog) => sum + blog.likes || 0, 0)
    return result
}

const favoriteBlog = (blogs) => {
    if(!Array.isArray(blogs) || blogs.length == 0)
        return null

    const foundBlog =  blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
    const result = {
        title: blogFinded.title,
        author: blogFinded.author,
        likes: blogFinded.likes
    }
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}