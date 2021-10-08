const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bloglistHelper = require('../utils/bloglist_helper');

const api = supertest(app);

const Blog = require('../models/blog');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

describe('when there is initially some blogs saved', () => {
  test('bloglist are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb();
    expect(response).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific author is within the returned blogs', async () => {
    const response = await helper.blogsInDb();

    expect(response[1].author).toBe('Edsger W. Dijkstra');
  });

  test('blog unique id is defined', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('addition of a new blog', () => {
  var token = null;

  beforeEach(done => {
    const user = {
      username: 'root',
      password: 'sekret',
    };

    api
      .post('/api/login')
      .send(user)
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Learn React',
      author: 'Michael X',
      url: 'https://reactpatterns.com/',
      likes: 9,
    };

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(n => n.title);
    expect(titles).toContain('Learn React');
  });

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      likes: 5,
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    };

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const response = await helper.blogsInDb();

    expect(response).toHaveLength(helper.initialBlogs.length);
  });

  test('blog likes property default to 0', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    };

    const checkedPayload = await bloglistHelper.preparePayload(newBlog);

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(checkedPayload)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await helper.blogsInDb();
    expect(response[2].likes).toBe(0);
  });
});

describe('deletion of a blog', () => {
  var token = null;

  beforeEach(done => {
    const user = {
      username: 'root',
      password: 'sekret',
    };

    api
      .post('/api/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        const newBlog = {
          title: 'Learn React',
          author: 'Michael X',
          url: 'https://reactpatterns.com/',
          likes: 9,
        };

        api
          .post('/api/blogs')
          .set({ Authorization: `Bearer ${token}` })
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
          .end(done);
      });
  });

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[2];

    await api.delete(`/api/blogs/${blogToDelete.id}`).set({
      Authorization: `Bearer ${token}`,
    });
    expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const authors = blogsAtEnd.map(r => r.author);

    expect(authors).not.toContain(blogToDelete.author);
  });

  test('fails with status code 401 if auth token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[2];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'test1',
      name: 'Test One',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation failed with missing username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
