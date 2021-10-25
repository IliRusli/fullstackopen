import React, {useEffect, useState} from 'react';

const Blog = ({blog, handleSubmit, handleDelete}) => {
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const showWhenVisible = { display: visible ? '' : 'none' };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUserId(user.username);
    }
  }, []);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    margin: 5,
  };

  const updateBlogLikes = event => {
    event.preventDefault();
    handleSubmit(blog.id, {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    });
  };

  const removeBlog = event => {
    event.preventDefault();
    handleDelete(blog.id, {
      title: blog.title,
      author: blog.author,
    });
  };

  const deleteButton = () => {
    if (blog.user && userId === blog.user.username) {
      return <button onClick={removeBlog}>remove</button>;
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}
        <div>
          likes {blog.likes} <button onClick={updateBlogLikes}>like</button>
        </div>
        {deleteButton()}
      </div>
    </div>
  );
};

export default Blog;
