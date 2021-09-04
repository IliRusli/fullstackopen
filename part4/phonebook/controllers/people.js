const peopleRouter = require('express').Router();
const Person = require('../models/person');

peopleRouter.get('/', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

peopleRouter.get('/api/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(
      '<p>Phonebook has info for ' +
          people.length +
          ' persons</p><p>' +
          new Date() +
          '</p>'
    );
  });
});

peopleRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

peopleRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  Person.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

peopleRouter.post('/', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson);
    })
    .catch(error => next(error));
});

module.exports = peopleRouter;