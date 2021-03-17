const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

const date_options = { year: 'numeric', month: 'long', day: 'numeric' };

//'Home'
router.get('/', ensureAuthenticated, (req, res) => {
  Channel.find({ private: false }, (err, channels) => {
    if (err) return console.error(err);
    User.find({}, (err, users) => {
      if (err) return console.error(err);
      //console.log(users);
      res.render('channels', {
        channels: channels,
        user: req.user,
        users: users,
        cssdir: '/',
      });
    });
  });
});

//Get, post & delete to 'create channel'
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('ch_create.ejs', { cssdir: '/', user: req.user });
});

router.post('/create', ensureAuthenticated, (req, res) => {
  User.findOne({ email: req.body.userEmail }).exec((err, user) => {
    const channel = new Channel({
      by: user,
      name: req.body.name,
      description: req.body.description || '',
      private: req.body.private ? true : false,
    });
    channel.save((err) => {
      if (err) return console.error(err);
      console.log('The following channel was created:' + channel);
      res.redirect('/');
    });
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
  Channel.find({ private: false }, (err, channels) => {
    if (err) return console.error(err);
    User.find({}, (err, users) => {
      if (err) return console.error(err);
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
              channels,
              users,
              cssdir: '/',
              user: req.user,
              date_options: date_options,
            });
          }
        });
    });
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

//Start DM route
router.get('/startDM/:recieverUserId', ensureAuthenticated, (req, res) => {
  if (req.params.recieverUserId === req.user._id.toString())
    res.send('<h1>Profile page goes here</h1>');
  else {
    Channel.findOne({
      $and: [
        { private: true },
        { members: { $all: [req.user._id, req.params.recieverUserId] } },
      ],
    }).exec((err, channel) => {
      if (channel) {
        res.redirect(`/channels/${channel._id}`);
      } else {
        const channel = new Channel({
          by: req.user._id,
          name: 'DM_channel',
          description: 'DM_channel',
          private: true,
          members: [req.user._id, req.params.recieverUserId],
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

router.post('/startPM/:PMrecieverEmail', (req, res) => {
  //TODO check if channel exists aleady
  console.log('inside startPM POST route');
  console.log(req.user);
  console.log(req.params.PMrecieverEmail);
  res.render('pm_create', {
    cssdir: '/',
    user: req.user,
    PMreciever: req.params.PMrecieverEmail,
  });
});

module.exports = router;
