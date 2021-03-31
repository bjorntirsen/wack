const Channel = require('../models/channel');
const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = (req, res) => {
  const post = new Post({
    by: req.user._id,
    content: req.body.content,
  });
  post.save((err) => {
    if (err) return console.log(err);
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (error) => {
        if (error) return console.log(error);
        res.status(201).json(post);
      }
    );
  });
};

exports.getAllPublicChannels = (req, res) => {
  Channel.find({ private: false }, (err, channels) => {
    if (err) return console.log(err);
    res.status(200).json(channels);
  });
};

exports.getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) return console.log(err);
    res.status(200).json(users);
  });
};
