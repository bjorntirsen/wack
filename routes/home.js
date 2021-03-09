const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

router.get('/', ensureAuthenticated, (req, res) => {
  Channel.find((err, data) => {
    if (err) return console.error(err);
    res.render('home.ejs', { channels: data, user: req.user });
  });
});

router.get('/channels/create', ensureAuthenticated, (req, res) => {
  res.render('ch_create.ejs', { cssdir: '../' });
});

router.post('/channels/create', ensureAuthenticated, (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err) => {
    if (err) return console.error(err);
    console.log('Channel created.');
    res.redirect('/home');
  });
});

router.get('/channels/delete/:id', ensureAuthenticated, (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/');
  });
});

router.get('/channels/:id', ensureAuthenticated, async (req, res) => {
  let channels = [];
  await Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
  let channel = {};
  await Channel.findOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    channel = data;
  });
  res.render('channel', { channel, channels, cssdir: '/' });
});

router.post('/channels/:id', ensureAuthenticated, (req, res) => {
  const post = new Post({
    by: req.body.user,
    content: req.body.content,
  });
  Channel.updateOne(
    { _id: req.params.id },
    { $push: { posts: post } },
    (err) => {
      if (err) return console.error(err);
      res.redirect(`/channels/${req.params.id}`);
    }
  );
});

module.exports = router;