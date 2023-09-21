import { useParams } from 'react-router-dom'
import userService from '../services/users'
import { useEffect, useState } from 'react'
const User = () => {
  const [userDetail, setUserDetail] = useState()
  const id = useParams().id

  useEffect(() => {
    userService.getAll().then((res) => {
      setUserDetail(res.filter((user) => user.id === id)[0])
    })
  }, [id])

  if (!userDetail) {
    return
  }

  return (
    <div>
      <h2>{userDetail.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {userDetail.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
