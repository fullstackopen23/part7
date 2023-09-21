import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = (newToken) => {
  console.log('token set to ', newToken)
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const post = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.post(baseUrl, blog, config)
  return request.data
}

const postComment = async (blog) => {
  const request = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    blog
  )
  return request.data
}

const like = async (blog) => {
  const request = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return request.data
}

const put = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.put(
    `${baseUrl}/${blog.id}`,
    blog,
    config
  )
  return request.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.delete(`${baseUrl}/${blog.id}`, config)
  console.log(request)
  return request.data
}

export default {
  getAll,
  post,
  setToken,
  put,
  remove,
  postComment,
  like,
}
