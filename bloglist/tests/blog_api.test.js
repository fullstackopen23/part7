const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require("bcrypt")


const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: "Freddy",
    url: "https:123.de",
    likes: 2
  },
  {
    title: 'CSS is hard',
    author: "Meck",
    url: "https:1222222223.de",
    likes: 0
  }
]

const newBlog = {
  title: 'React is nice123',
  author: "Fredd",
  url: "htt1ps:123.de",
  likes: 110 
}

const newBlogWithoutLikes = {
  title: 'Flutter',
  author: "Jakob",
  url: "htt1ps:123.de",
}

const newBlogWithoutTitle = {
  author: "Jakob",
  likes: 10,
  title: "rud-.-.-y"
}

const newBlogWithoutUrl = {
  author: "Jakob",
  title: 'Flutter',
  likes: 10,
}

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test("the blog list application returns the correct amount of blog posts", async () => {
  const response = await api
  .get('/api/blogs')
  
  expect(response.body).toHaveLength(initialBlogs.length)
})


test("verifies that the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})


test("posting blogs works ", async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const res1 = await api.post('/api/login').send({username: "root", password: "sekret"})
  const token = res1.body.token
  await api.post('/api/blogs').send(newBlog).set('Authorization', 'bearer ' + token)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain("React is nice123")
})

test("posting blogs without token doenst work", async () => {
  
  await api.post('/api/blogs').send(newBlog).set('Authorization', 'bearer invalidToken').expect(401)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})


test("Delete one Blog", async () => {
  const blogs = await Blog.find({})  
  await blogs[0].deleteOne()
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(initialBlogs.length-1)
    
})


test("Update one Blog", async () => {
  const blogs = await Blog.find({})  
  const res = await api.put(`/api/blogs/${blogs[0].id}`).send(newBlog)

  expect(res.body.title).toContain("React is nice1")
    
})

afterAll(async () => {
  await mongoose.connection.close()
})