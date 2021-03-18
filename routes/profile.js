const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth.js');

router.use(express.urlencoded({ extended: true }));

router.get('/:userId', ensureAuthenticated, (req, res) => {
  if (req.params.userId === req.user._id.toString()) {
    Channel.find({ private: false }, (err, channels) => {
      if (err) return console.error(err);
      User.find({}, (err, users) => {
        if (err) return console.error(err);
        //console.log(users);
        res.render('profile', {
          channels: channels,
          user: req.user,
          users: users,
          cssdir: '/',
        });
      });
    });
  } else {
    res.redirect(`/`);
  }
});

router.post('/uploadPhoto', ensureAuthenticated, (req, res) => {
  try {
    if (req.files) {
      console.log('inside post');
      const profile_pic = req.files.profile_pic;
      console.log(profile_pic)
      const extension = profile_pic.name.split('.').slice(-1)[0];
      console.log(extension)
      const file_name = `/uploads/${req.user._id}.${extension}`;
      console.log(file_name);
      profile_pic.mv(file_name);
      User.updateOne({_id: req.user._id}, { $set: { profilePhoto: file_name } }).exec(
        (error, data) => {
          if (error) console.log(error);
          console.log(data);
          res.redirect(`/profile/${req.user._id}`);
        }
      );
    } else {
      res.send('<h1>Err: No file uploaded.</h1>');
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
