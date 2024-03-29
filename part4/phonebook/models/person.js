const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// eslint-disable-next-line no-undef

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, unique: true },
  number: {
    type: String,
    required: true,
    minLength: 8,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Apply the uniqueValidator plugin to userSchema.
personSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Person', personSchema);
