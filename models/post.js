const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  by: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  content: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

module.exports = mongoose.model('Post', postSchema);
