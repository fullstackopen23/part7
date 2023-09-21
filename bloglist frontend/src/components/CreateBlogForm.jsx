import { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationAndDelete } from '../reducers/notificationReducer'
import { initializeBlogs } from '../reducers/blogsReducer'

const CreateBlogForm = ({
  createBlog,
  createFormRef,
  setBlogs,
  setMessage,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      createFormRef.current.toggleVisibility()
      const res = await blogService.getAll()
      dispatch(initializeBlogs())
      dispatch(
        setNotificationAndDelete(
          `a new blog ${title} by ${author} added`,
          5
        )
      )
    } catch (error) {
      console.log(error)
      dispatch(setNotificationAndDelete('an error occured!', 5))
    }
  }

  return (
    <form onSubmit={handleCreate}>
      <h2>create new</h2>
      <p>
        title:{' '}
        <input
          id="title"
          placeholder="title..."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </p>
      <p>
        author:{' '}
        <input
          id="author"
          placeholder="author..."
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </p>
      <p>
        url:{' '}
        <input
          id="url"
          placeholder="url..."
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </p>
      <button id="createBtn">create</button>
    </form>
  )
}

export default CreateBlogForm
