/* eslint-disable no-undef */
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.bwtvi.mongodb.net/fullstackopen?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && phoneNumber) {
  const person = new Person({
    name: name,
    number: phoneNumber,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
