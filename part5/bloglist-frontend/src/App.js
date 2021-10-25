import React, { useEffect, useRef, useState } from 'react';

import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState(null);

  const blogformRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async loginObject => {
    setMessage(null);
    try {
      const user = await loginService.login(loginObject);
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setMessage('wrong username or password');
      setHasError(true);
    }
  };

  const handleLogout = async event => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogListUser');
    setUser(null);
  };

  const loginForm = () => {
    return (
      <>
        <h2>login to blog list application</h2>
        <Notification message={message} hasError={hasError} />
        <Togglable buttonLabel="login">
          <LoginForm handleSubmit={handleLogin} />
        </Togglable>
      </>
    );
  };

  const addBlog = blogObject => {
    setMessage(null);
    blogformRef.current.toggleVisibility();
    blogService.create(blogObject).then(returnedBlog => {
      setHasError(false);
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const blogForm = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogformRef}>
        <BlogForm handleSubmit={addBlog} />
      </Togglable>
    </>
  );

  const updateBlog = (id, blogObject) => {
    setMessage(null);
    blogService.update(id, blogObject).then(returnedBlog => {
      setHasError(false);
      setMessage(
        `${returnedBlog.title} by ${returnedBlog.author} like count has been updated`
      );
      blogService.getAll().then(blogs => setBlogs(blogs));
    });
  };

  const deleteBlog = (id, blogObject) => {
    setMessage(null);
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)
    ) {
      blogService.deleteBlog(id).then(returnedBlog => {
        setHasError(false);
        setMessage(`Blog ${blogObject.title} has been succesfully deleted`);
        blogService.getAll().then(blogs => setBlogs(blogs));
      });
    }
  };

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} hasError={hasError} />
      <p>
        {user.username} logged in.{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <>{blogForm()}</>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleSubmit={updateBlog}
            handleDelete={deleteBlog}
          />
        ))}{' '}
    </div>
  );

  return <div>{user === null ? loginForm() : blogList()}</div>;
};
export default App;
