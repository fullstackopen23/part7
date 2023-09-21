import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { initializeBlogs } from '../reducers/blogsReducer'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleRemove = async (blog) => {
    await blogService.remove(blog)
    const res = await blogService.getAll()
    dispatch(initializeBlogs())
    console.log(res)
  }

  const showRemoveBtn = (blog) => {
    if (blog.user.id === user.id) {
      return (
        <button
          onClick={() => {
            handleRemove(blog)
          }}
        >
          remove
        </button>
      )
    } else {
      return null
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} <br></br>
        {blog.author}
      </Link>

      {showRemoveBtn(blog)}
    </div>
  )
}

export default Blog
