const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

const date_options = { year: 'numeric', month: 'long', day: 'numeric' };

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('channels', {
    user: req.user,
    cssdir: '/',
  });
});

//Get, post & delete to 'create channel'
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('ch_create.ejs', { cssdir: '/', user: req.user });
});

router.post('/create', ensureAuthenticated, (req, res) => {
  const channel = new Channel({
    by: req.user._id,
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    console.log('The following channel was created:' + channel);
    res.redirect('/channels');
  });
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/');
  });
});

//Get & post to channel id
router.get('/:id', ensureAuthenticated, (req, res) => {
  Channel.findOne({ _id: req.params.id })
    .populate({
      path: 'posts',
      populate: {
        path: 'by',
        model: 'User',
      },
    })
    .exec((err, channel) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', 'The requested channel does not exist.');
        res.redirect('/');
      } else {
        res.render('channels', {
          channel,
          cssdir: '/',
          user: req.user,
          date_options: date_options,
        });
      }
    });
});

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
        res.redirect(`${req.params.id}`);
      }
    );
  });
});

//DM or profile
router.get('/DMorProfile/:userId', ensureAuthenticated, (req, res) => {
  if (req.params.userId === req.user._id.toString())
    res.redirect('/profile/');
  else {
    Channel.findOne({
      $and: [
        { private: true },
        { members: { $all: [req.user._id, req.params.UserId] } },
      ],
    }).exec((err, channel) => {
      if (err) return console.error(err);
      if (channel) {
        res.redirect(`/channels/${channel._id}`);
      } else {
        const channel = new Channel({
          by: req.user._id,
          name: 'DM_channel',
          description: 'DM_channel',
          private: true,
          members: [req.user._id, req.params.userId],
        });
        channel.save((err, channel) => {
          if (err) return console.error(err);
          console.log('The following channel was created:' + channel);
          res.redirect(`/channels/${channel._id}`);
        });
      }
    });
  }
});

module.exports = router;
