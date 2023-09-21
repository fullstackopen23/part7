import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('renders blogs title and author by default', () => {
  const blog = {
    author: 'Jest Author',
    title: 'Jest Title',
    url: 'Jest ulr',
    likes: 0
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Jest Title Jest Author', { exact : false }
  )
  expect(div).not.toHaveTextContent(
    'Url'
  )
})

test('blogs url and likes are shown when button has been clicked', async () => {
  const blog = {
    author: 'Jest Author',
    title: 'Jest Title',
    url: 'Jest URL',
    likes: 0,
    user: {
      name: 'Benni',
      id: '123'
    }
  }
  const user1 = {
    id: '123'
  }

  const { container } = render(<Blog user={user1} blog={blog} />)

  const user = userEvent.setup()
  const button = container.querySelector('#viewBtn')
  const div = container.querySelector('.blog')
  await user.click(button)
  expect(div).toHaveTextContent(
    'Jest URL', { exact : false }
  )
  expect(div).toHaveTextContent(
    'likes', { exact : false }
  )
})

test('if likes button is clicked twice, the event handler also called twice', async () => {
  const blog = {
    author: 'Jest Author',
    title: 'Jest Title',
    url: 'Jest URL',
    likes: 0,
    user: {
      name: 'Benni',
      id: '123'
    }
  }
  const user1 = {
    id: '123'
  }

  const mockHandlerLike = jest.fn()

  const { container } = render(<Blog handleLikeBtn={mockHandlerLike} user={user1} blog={blog}/>)

  const user = userEvent.setup()
  const viewButton = container.querySelector('#viewBtn')
  await user.click(viewButton)
  const likeBtn = container.querySelector('#likeBtn')
  await user.click(likeBtn)
  await user.click(likeBtn)
  expect(mockHandlerLike.mock.calls).toHaveLength(2)
})

test('blog form', async () => {

  const createBlog = jest.fn()
  const mockHandler = jest.fn()
  const user = userEvent.setup()
  const createFormRef = {
    current: {
      toggleVisibility: mockHandler
    }
  }
  const { container } = render(<CreateBlogForm setBlogs={mockHandler} createFormRef={createFormRef} setMessage={mockHandler} createBlog={createBlog}/>)


  const input = screen.getByPlaceholderText('title...')
  const author = screen.getByPlaceholderText('author...')
  const url = screen.getByPlaceholderText('url...')
  const createBtn = container.querySelector('#createBtn')

  await user.type(input, 'testing a form...')
  await user.type(author, 'testing a form...')
  await user.type(url, 'testing a form...')
  await user.click(createBtn)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a form...')
})