const mongoose = require('mongoose');

const { Schema } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A channel must have a name'],
    minLength: 1,
    maxLength: 100,
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'by',
    required: [true, 'A channel must have a creator'],
  },
  description: {
    type: String,
    maxLength: 200,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = mongoose.model('Channel', channelSchema);
