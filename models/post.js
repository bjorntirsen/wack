const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  by: {
    type: Schema.Types.ObjectId,
    ref: 'by',
    required: true,
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
