const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  readBy: [{ type: Schema.Types.ObjectId, ref: 'ReadBy' }],
  edited: {
    type: Boolean,
    default: false,
  },
});

postSchema.virtual('formattedDate').get(function () {
  function addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  const date_options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = this.date;
  const date = dateObj.toLocaleDateString('en-gb', date_options);
  const hours = addZero(dateObj.getHours());
  const minutes = addZero(dateObj.getMinutes());
  return `on ${date} at ${hours}:${minutes}:`;
});

module.exports = mongoose.model('Post', postSchema);
