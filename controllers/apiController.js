const Channel = require('../models/channel');
const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = (req, res) => {
  var post = new Post({
    by: req.user._id,
    content: req.body.content,
  });
  post.save((err) => {
    if (err) return handleError(err);
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (err) => {
        if (err) return handleError(err);
        res.status(201).json(post);
      }
    );
  });
};

exports.getAllPublicChannels = (req, res) => {
  Channel.find({ private: false }, (err, channels) => {
    if (err) return handleError(err);
    res.status(200).json(channels);
  });
}

exports.getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return handleError(err);
    res.status(200).json(users);
  });
}
