import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useEffect, useState } from 'react'
const BlogDetail = () => {
  const [blog, setBlog] = useState(null)
  const id = useParams().id
  const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
      setValue(event.target.value)
    }

    return {
      type,
      value,
      onChange,
    }
  }
  const name = useField('text')

  useEffect(() => {
    blogService.getAll().then((res) => {
      console.log(res.filter((blog) => blog.id === id))
      setBlog(res.filter((user) => user.id === id)[0])
    })
  }, [id])

  const handleLikeBtn = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      }
      const res = await blogService.like(updatedBlog)
      console.log(res)
      const temp = await blogService.getAll()
      console.log(temp.filter((a) => a.id === blog.id))

      setBlog(temp.filter((a) => a.id === blog.id)[0])
    } catch (error) {
      console.log('Error by handling like', error)
    }
  }

  if (!blog) {
    return
  }

  const handleAddComment = async (e, blog) => {
    e.preventDefault()
    const newBlog = { ...blog, comment: name.value }
    const res = await blogService.postComment(newBlog)
    setBlog(res)
  }

  if (!blog.user) {
    return
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href="#">{blog.url}</a>
      <p>{blog.likes}</p>{' '}
      <button
        onClick={() => {
          handleLikeBtn(blog)
        }}
      >
        like
      </button>
      <p>added by {blog.user.username}</p>
      <p>comments: </p>
      <input
        type={name.type}
        value={name.value}
        onChange={name.onChange}
      />{' '}
      <button
        onClick={(e) => {
          handleAddComment(e, blog)
        }}
      >
        add comment
      </button>
      {blog.comments.map((comment, i) => (
        <li key={i}>{comment}</li>
      ))}
    </div>
  )
}

export default BlogDetail
