const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

router.get('/', ensureAuthenticated, (req, res) => {
  Channel.find((err, data) => {
    if (err) return console.error(err);
    res.render('home.ejs', { channels: data, user: req.user });
  });
});

router.get('/channels/create', ensureAuthenticated, (req, res) => {
  res.render('ch_create.ejs', { cssdir: '/', user: req.user });
});

router.post('/channels/create', ensureAuthenticated, (req, res) => {
  User.findOne({email: req.body.userEmail }).exec((err, user) => {
    const channel = new Channel({
      by: user,
      name: req.body.name,
      description: req.body.description || '',
      private: req.body.private ? true : false,
    });
    channel.save((err) => {
      if (err) return console.error(err);
      console.log('The following channel was created:' + channel);
      res.redirect('/home');
    });
  })
});

router.get('/channels/delete/:id', ensureAuthenticated, (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/');
  });
});

router.get('/channels/:id', ensureAuthenticated, (req, res) => {
  //let channels = [];
  Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
  //let channel = {};
  Channel.findOne({ _id: req.params.id })
    .populate({
      path: 'posts',
      populate: {
        path: 'by',
        model: 'User'
      }
    })
    .exec((err, channel) => {
    if (err) {
      console.log(err)
      req.flash('error_msg', 'The requested channel does not exist.');
      res.redirect('/home/');
    } else {
      
      console.log(channel)
      console.log(channel.posts[0])
      res.render('channel', { channel, channels, cssdir: '/', user: req.user });
    };
  });
});

router.post('/channels/:id', ensureAuthenticated, (req, res) => {
  User.findOne({email: req.body.userEmail }).exec((err, user) => {
    if (err) return console.error(err);
    const post = new Post({
      by: user,
      content: req.body.content,
    });
    post.save();
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (err) => {
        if (err) return console.error(err);
        console.log('The following post was created:' + post);
        res.redirect(`${req.params.id}`);
      }
    );
  })
});

module.exports = router;