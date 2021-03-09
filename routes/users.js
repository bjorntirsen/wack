const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Channel = require('../models/channel');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.use(express.urlencoded({ extended: true }));

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields.' });
  }
  //check if match
  if (password !== password2) {
    errors.push({ msg: `Passwords doesn't match.` });
  }
  //check if password is more than 6 characters
  if (password.length < 6) {
    errors.push({ msg: 'Your password must be at least 6 characters long.' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2,
    });
  } else {
    //validation passed
    User.findOne({ email: email }).exec((err, user) => {
      console.log(user);
      if (user) {
        errors.push({ msg: 'Email already registered.' });
        res.render('register', {
          res,
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
        });
        //hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //save pass to hash
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then((value) => {
                console.log(value);
                req.flash('success_msg', 'You have now registered!');
                res.redirect('/signin');
              })
              .catch((value) => console.log(value));
          });
        });
      }
    });
  }
});

router.get('/home', (req, res) => {
  Channel.find((err, data) => {
    if (err) return console.error(err);
    res.render('home.ejs', { channels: data });
  });
});

router.get('/channels/create', (req, res) => {
  res.render('ch_create.ejs', { cssdir: '../' });
});

router.post('/channels/create', (req, res) => {
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

router.get('/delete/:id', (req, res) => {
  Channel.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    console.log(req.params.id + 'deleted');
    res.redirect('/');
  });
});

router.get('/channels/:id', async (req, res) => {
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
  res.render('channel', { channel, channels, cssdir: '../' });
});

router.post('/channels/:id', (req, res) => {
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
