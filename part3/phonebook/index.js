require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.static('build'));

// json parser middleware
app.use(express.json());

// request logger middleware
var morgan = require('morgan');
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

const Person = require('./models/person');

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
  {
    name: 'Hei',
    number: '3444555',
    id: 6,
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/api/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(
        '<p>Phonebook has info for ' + people.length + ' persons</p><p>' +
        new Date() + '</p>');
  });
});

app.get('/api/persons/:id', (request, response, next) => {
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

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end();
      })
      .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  Person.findByIdAndUpdate(request.params.id, body, {new: true})
      .then(updatedPerson => {
        response.json(updatedPerson);
      })
      .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
      .then(person => {
        response.json(person);
      })
      .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'});
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
