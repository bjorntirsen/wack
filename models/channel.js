const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
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
  posts: [{ type: Schema.Types.ObjectId, ref: 'post' }],
});

module.exports = mongoose.model('Channel', channelSchema);
