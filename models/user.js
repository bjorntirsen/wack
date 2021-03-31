const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A post must have creator'],
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  adminUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  profilePhoto: {
    type: String,
    default: '/public/nophoto.png',
  },
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
