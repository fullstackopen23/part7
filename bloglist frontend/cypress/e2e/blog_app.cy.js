describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Felix Blume',
      username: 'Kollegah',
      password: '123456'
    }

    const userLogin = {
      username: 'Kollegah',
      password: '123456'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.request('POST', 'http://localhost:3001/api/login', userLogin)


    cy.visit('http://localhost:5173')

  })

  it('Login form is shown', function() {
    window.localStorage.clear()
    cy.contains('log in to application')
  })

  describe('Login',function() {
    window.localStorage.clear()
    it('succeeds with correct credentials', function() {
      cy.get('#password').type('123456')
      cy.get('#username').type('Kollegah')
      cy.get('#login-button').click()
      cy.contains('Felix Blume logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('Kollegah')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })

  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#password').type('123456')
      cy.get('#username').type('Kollegah')
      cy.get('#login-button').click()
      cy.contains('Felix Blume logged in')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah')
      cy.get('#author').type('Kollegah')
      cy.get('#url').type('Kollegah')
      cy.get('#createBtn').click()

      cy.contains('Kollegah Kollegah')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah')
      cy.get('#author').type('Kollegah')
      cy.get('#url').type('Kollegah')
      cy.get('#createBtn').click()

      cy.contains('Kollegah Kollegah')
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be removed', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah')
      cy.get('#author').type('Kollegah')
      cy.get('#url').type('Kollegah')
      cy.get('#createBtn').click()

      cy.contains('Kollegah Kollegah')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('Kollegah Kollegah').should('not.exist')
    })

    it('A blog cannot be removed by other users', function() {
      const user = {
        name: 'Jakob Bobic',
        username: 'Bobic',
        password: '123456'
      }

      const userLogin = {
        username: 'Bobic',
        password: '123456'
      }

      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah')
      cy.get('#author').type('Kollegah')
      cy.get('#url').type('Kollegah')
      cy.get('#createBtn').click()

      cy.contains('Kollegah Kollegah')

      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.request('POST', 'http://localhost:3001/api/login', userLogin)
      cy.contains('log out').click()

      cy.get('#password').type('123456')
      cy.get('#username').type('Bobic')
      cy.get('#login-button').click()
      cy.contains('Jakob Bobic logged in')

      cy.contains('view').click()
      cy.contains('remove').should('not.exist')

    })

    it.only('blogs are orderd according to likes with most likes being first', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah')
      cy.get('#author').type('Kollegah')
      cy.get('#url').type('Kollegah')
      cy.get('#createBtn').click()

      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah2')
      cy.get('#author').type('Kollegah2')
      cy.get('#url').type('Kollegah2')
      cy.get('#createBtn').click()

      cy.contains('new blog').click()
      cy.get('#title').type('Kollegah3')
      cy.get('#author').type('Kollegah3')
      cy.get('#url').type('Kollegah3')
      cy.get('#createBtn').click()

      cy.get('.blog').contains("Kollegah Kollegah").contains("view").click()
      cy.get('.blog').contains("Kollegah Kollegah").contains("like", {timeout: 1000}).click()

      cy.get('.blog').contains("Kollegah2 Kollegah2").contains("view").click()
      cy.get('.blog').contains("Kollegah2 Kollegah2").contains("like").wait(2000).click()
      cy.get('.blog').contains("Kollegah2 Kollegah2").contains("like").wait(2000).click()

      cy.get('.blog').contains("Kollegah3 Kollegah3").contains("view").wait(2000).click()
      cy.get('.blog').contains("Kollegah3 Kollegah3").contains("like").wait(2000).click()
      cy.get('.blog').contains("Kollegah3 Kollegah3").contains("like").wait(2000).click()
      cy.get('.blog').contains("Kollegah3 Kollegah3").contains("like").wait(2000).click()

      cy.get('.blog').eq(0).contains("Kollegah3 Kollegah3")
      cy.get('.blog').eq(1).contains("Kollegah2 Kollegah2")
      cy.get('.blog').eq(2).contains("Kollegah Kollegah")
      
    })
  })
})