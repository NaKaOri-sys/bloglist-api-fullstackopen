const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const blogHelper = require('../utils/blogs_helper')
const api = supertest(app)

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await listHelper.initializeUser()
  const user = await listHelper.usersInDb()
  await Blog.deleteMany({})
  let blogObject = new Blog(blogHelper.initialBlog[0])
  blogObject.user = user[0].id
  await blogObject.save()

  blogObject = new Blog(blogHelper.initialBlog[1])
  blogObject.user = user[0].id
  await blogObject.save()
})

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
  const emptyBlogList = []

  const oneBlog = [
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 5,
      __v: 0
    }
  ]
  const blogWithNoLikesProperty = [
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0
    }
  ]

  test('of empty list is zero', () => { assert.strictEqual(listHelper.totalLikes(emptyBlogList), 0) })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(oneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list calculated  right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('given no like property, default value is 0', () => {
    const result = listHelper.totalLikes(blogWithNoLikesProperty)
    assert.strictEqual(result, 0)
  })
})

describe('favoriteBlog', () => {
  const blogExpectedWithBiggestList = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12,
  }
  test('the most favorite blog with a biggest list', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogExpectedWithBiggestList)
  })
  test('of empty list is null result', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, null)
  })
})

describe('mostAuthor', () => {
  test('should return  the  author  with the  most  blogs', async () => {
    const result = listHelper.mostBlog(blogs)
    const authorExpected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, authorExpected)
  })
  test('should  return undefined  for  empty  blog  list', () => {
    const result = listHelper.mostBlog([]);
    assert.strictEqual(result, undefined);
  })

  test('should  return the  only  author  when  list has  one  blog', () => {
    const singleBlog = [
      {
        _id: "1",
        title: "Solo  blog",
        author: "Ada  Lovelace",
        url: "http://example.com",
        likes: 10,
        __v: 0
      }
    ];
    const result = listHelper.mostBlog(singleBlog)
    const expected = {
      author: 'Ada  Lovelace',
      blogs: 1
    };
    assert.deepStrictEqual(result, expected);
  })
})

describe('mostLikes', () => {
  test('should  return  null  for  an empty  list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, undefined)
  })

  test('should return the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    const authorExpected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    assert.deepStrictEqual(result, authorExpected)
  })

  test('should return  the  only  author  when  list  has  one blog', () => {
    const singleBlog = [blogs[0]]
    const result = listHelper.mostLikes(singleBlog)
    const authorExpected = {
      author: 'Michael Chan',
      likes: 7
    }
    assert.deepStrictEqual(result, authorExpected)
  })
})

test('blog list are equals than db', async () => {
  const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, blogHelper.initialBlog.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "WOLOLO PC",
    author: "Some random",
    url: "www.qweqwe.com.ar",
    likes: 14
  }
  const loginResponse = await api.post('/api/login').send({
    username: 'root',
    password: 'sekret'
  })
  const token = loginResponse.body.token

  await api.post('/api/blogs').send(newBlog).set({ authorization: `Bearer ${token}` }).expect(201).expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const title = response.body.map(b => b.title)

  assert.strictEqual(response.body.length, blogHelper.initialBlog.length + 1)
  assert(title.includes(newBlog.title))
})

test(`the unique identificator is 'id' for all the blogs.`, async () => {
  const blogsInDb = await blogHelper.blogsInDb();
  blogsInDb.forEach(b => { assert.ok(b.hasOwnProperty('id'), `The object  ${JSON.stringify(b)}  does not have an 'id' property.`) })
})

test('a valid blog cannot be added because not token in header', async () => {
  const newBlog = {
    title: "River el más grande",
    author: "Marcelo Daniel Gallardo",
    url: "www.rivercamp.com.ar",
    likes: 21
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('should create a blog without likes property and this one is zero by default', async () => {
  const newBlog = {
    title: "GTA VI seguro es GOTY",
    author: "Testing auth",
    url: "www.pcgamermasterrace.com.ar"
  }
  const loginResponse = await api.post('/api/login').send({
    username: 'root',
    password: 'sekret'
  })
  const token = loginResponse.body.token
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ authorization: `Bearer ${token}` })
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const createdBlog = response.body.find(blog => blog.title === newBlog.title)
  assert(createdBlog)
  assert.strictEqual(createdBlog.likes, 0)
})

test('should not create a blog when the title or the url are missing.', async () => {
  const blogWhithoutTitle = {
    author: "Testing auth",
    url: "www.pcgamermasterrace.com.ar"
  }
  const blogWhithoutUrl = {
    title: "GTA VI seguro es GOTY",
    author: "Testing auth",
  }
  const loginResponse = await api.post('/api/login').send({
    username: 'root',
    password: 'sekret'
  })
  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .send(blogWhithoutTitle)
    .set({ authorization: `Bearer ${token}` })
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .send(blogWhithoutUrl)
    .set({ authorization: `Bearer ${token}` })
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

describe('delete blog', () => {
  test('deletes an existing blog', async () => {
    const blogsInDb = await blogHelper.blogsInDb()
    const blogToDelete = blogsInDb[0]
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret'
    })
    const token = loginResponse.body.token
    const res = await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${token}` })
    assert.strictEqual(res.status, 204)

    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length, blogsInDb.length - 1)
  })

  test('returns 404 if blog does not exist', async () => {
    const validNonExistingId = new mongoose.Types.ObjectId()
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret'
    })
    const token = loginResponse.body.token
    const res = await api.delete(`/api/blogs/${validNonExistingId}`)
      .set({ authorization: `Bearer ${token}` })
    assert.strictEqual(res.status, 404)
  })

  test('returns 400 for malformed blog ID', async () => {
    const invalidId = 'id-malformado'
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret'
    })
    const token = loginResponse.body.token
    const res = await api.delete(`/api/blogs/${invalidId}`)
      .set({ authorization: `Bearer ${token}` })
    assert.strictEqual(res.status, 400)
  })

})

describe('update blog', () => {
  test('successfully updates the likes of an existing blog', async () => {
    const blogsAtStart = await blogHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedLikes = { likes: blogToUpdate.likes + 1 }
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedLikes.likes)
  })

  test('returns 400 if likes is not a number', async () => {
    const blogsAtStart = await blogHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const invalidLikes = { likes: 'a lot' }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidLikes)
      .expect(400)
  })

  test('returns 400 if likes is negative', async () => {
    const blogsAtStart = await blogHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const invalidLikes = { likes: -5 }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidLikes)
      .expect(400)
  })

  test('returns 404 if blog does not exist', async () => {
    const nonExistingId = await blogHelper.nonExistingId()
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send({ likes: 10 })
      .expect(404)
  })

  test('returns 400 if blog ID is malformed', async () => {
    await api
      .put('/api/blogs/invalid-id-123')
      .send({ likes: 10 })
      .expect(400)
  })
})


after(async () => {
  await mongoose.connection.close()
})