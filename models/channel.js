const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  by: {
    type: Schema.Types.ObjectId,
    ref: 'by',
    required: true,
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
