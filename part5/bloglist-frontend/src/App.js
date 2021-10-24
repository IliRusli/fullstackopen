import React, { useEffect, useState } from 'react';

import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [hasError, setHasError] = useState(false);

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

  const handleLogin = async event => {
    event.preventDefault();
    setMessage(null);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
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

  const loginForm = () => (
    <>
      <h2>login to blog list application</h2>
      <Notification message={message} hasError={hasError} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>{' '}
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const addBlog = event => {
    setMessage(null);
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    blogService.create(blogObject).then(returnedBlog => {
      setHasError(false);
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setBlogs(blogs.concat(returnedBlog));
      setAuthor('');
      setTitle('');
      setUrl('');
    });
  };

  const blogForm = () => (
    <>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author{' '}
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} hasError={hasError} />
      <p>
        {user.username} logged in.{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <p>{blogForm()}</p>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}{' '}
    </div>
  );

  return <div>{user === null ? loginForm() : blogList()}</div>;
};
export default App;
