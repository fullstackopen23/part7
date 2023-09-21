import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { setNotificationAndDelete } from '../reducers/notificationReducer'
import { Table, Form, Button } from 'react-bootstrap'

const Login = (props) => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername(null)
      setPassword(null)
    } catch (exception) {
      console.log('error wrong credentials')
      dispatch(
        setNotificationAndDelete('wrong username or password', 3)
      )
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <h1>Welcome to my blog app!</h1>
      <h2>Please log in</h2>

      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          name="username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <Form.Label>password:</Form.Label>

        <Form.Control
          type="password"
          name="password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" id="login-button">
        login
      </Button>
    </Form>
  )
}

export default Login
