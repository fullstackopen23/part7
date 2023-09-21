const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require("./test_helper")


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const newUser = {
      username: 'ABCABC',
      name: 'Freddy Luukkainen',
      password: 'ABCABC',
    }
    
    await api
    .post('/api/users')
    .send(newUser)

    await user.save()
    
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Kakaka',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with a missing username', async () => {
    const usersAtStart = await helper.usersInDb()

    // missing username
    const newUser = {
      name: 'Fre Luukkainen',
      password: 'salainen'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toContain('username missing or too short')


    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const names = usersAtEnd.map(u => u.name)
    expect(names).not.toContain(newUser.name)
  })
})