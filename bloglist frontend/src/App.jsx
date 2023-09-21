import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import Login from './components/Login'
import { setNotificationAndDelete } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import UsersList from './components/UsersList'
import User from './components/User'
import Notification from './components/Notification'
import BlogDetail from './components/BlogDetail'
import { Alert, Navbar, Nav } from 'react-bootstrap'

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const createFormRef = useRef()

  const createBlog = async (blog) => {
    return blogService.post(blog)
  }

  return (
    <div>
      <Togglable buttonLabel={'new blog'} ref={createFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
          createFormRef={createFormRef}
          user={user}
        />
      </Togglable>

      <div className="blogs">
        {blogs.map((blog) => (
          <Blog blog={blog} user={user} key={blog.id} />
        ))}
      </div>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  // if localstorage is found than login automatically
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      dispatch(setUser(JSON.parse(loggedInUser)))
      blogService.setToken(JSON.parse(loggedInUser).token)
    }
  }, [])

  const handleLogOut = async (e) => {
    e.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    dispatch(setUser(null))
    dispatch(setNotificationAndDelete('TEST'), 3)
  }

  if (!user) {
    return (
      <div className="container">
        <Notification />
        <Login />
      </div>
    )
  } else {
    return (
      <div className="container">
        <Router>
          <Notification />

          <Navbar
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
          >
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#" as="span">
                  <Link to="/">home</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link to="/users">users</Link>
                </Nav.Link>

                <Nav.Link href="#" as="span">
                  {user ? (
                    <>
                      <em>{user.name} logged in</em>
                      <button onClick={handleLogOut}>log out</button>
                    </>
                  ) : (
                    <Link to="/login">login</Link>
                  )}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <h2>blog app</h2>

          <Routes>
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App
