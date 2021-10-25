const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  blog
    .save()
    .then(savedBlog => savedBlog.toJSON())
    .then(async savedAndFormattedBlog => {
      user.blogs = user.blogs.concat(savedAndFormattedBlog.id);
      await user.save();
      response.status(201).json(savedAndFormattedBlog);
    })
    .catch(error => next(error));
});

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const blog = await Blog.findById(id);

    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } else {
    response.status(400).end();
  }
});

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON());
    })
    .catch(error => next(error));
});

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const user = request.user;
    const blog = await Blog.findById(id);

    if (user && blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).send({ error: 'Unauthorized: invalid token' });
    }
  } else {
    response.status(400).end();
  }
});

module.exports = blogRouter;
