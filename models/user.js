const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  },
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
