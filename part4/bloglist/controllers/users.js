const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');

  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.password === undefined) {
    return response.status(400).json({ error: 'password is missing' });
  }

  if (body.username === undefined) {
    return response.status(400).json({ error: 'username is missing' });
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
