const express = require('express');
const router = express.Router();
const User = require('../models/user');
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
        res.render('signup', {
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
        //Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Save pass to hash
            newUser.password = hash;
            //Save user
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

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/signin',
    failureFlash: true,
  })(req, res, next);
});

router.get('/signout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are now logged out.');
  res.redirect('/signin');
});

module.exports = router;
