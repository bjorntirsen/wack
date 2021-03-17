const express = require('express');
const router = express.Router();
router.use(express.json());
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

router.post('/:id', ensureAuthenticated, (req, res) => {
  const post = new Post({
    by: req.user._id,
    content: req.body.content,
  });
  post.save((err) => {
    if (err) return console.error(err);
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (err) => {
        if (err) return console.error(err);
        res.end();
      }
    );
  });
});

module.exports = router;
