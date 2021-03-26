const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.handleRegister = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields.' });
  }
  if (password !== password2) {
    errors.push({ msg: `Passwords doesn't match.` });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Your password must be at least 6 characters long.' });
  }
  if (errors.length > 0) {
    res.render('signup', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2,
    });
  } else {
    User.findOne({ email: email }).exec((err, user) => {
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
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash('success_msg', 'You have now registered!');
                res.redirect('/signin');
              })
              .catch((value) => console.log(value));
          });
        });
      }
    });
  }
};

exports.handleSignIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/channels',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);
};

exports.handleSignOut = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are now logged out.');
  res.redirect('/signin');
};

exports.renderProfile = (req, res) => {
  res.render('profile', {
    user: req.user,
  });
};

exports.changeNameOrEmail = (req, res) => {
  const userName = req.body.newUserName;
  const userEmail = req.body.newUserEmail;
  User.updateOne(
    { _id: req.user._id },
    { $set: { name: userName, email: userEmail } }
  ).exec((err, data) => {
    if (err) console.log(err);
    req.flash('success_msg', 'Sucessfully edited user details.');
    res.redirect(`/users/profile/`);
  });
};

exports.uploadPhoto = (req, res) => {
  try {
    if (req.files) {
      const profile_pic = req.files.profile_pic;
      const extension = profile_pic.name.split('.').slice(-1)[0];
      const file_name = `/uploads/${req.user._id}.${extension}`;
      profile_pic.mv(`.${file_name}`);
      User.updateOne(
        { _id: req.user._id },
        { $set: { profilePhoto: file_name } }
      ).exec((error, data) => {
        if (error) console.log(error);
        req.flash('success_msg', 'Sucessfully uploaded photo.');
        res.redirect(`/users/profile/`);
      });
    } else {
      res.render('<h1>Error: No file uploaded.</h1>');
    }
  } catch (error) {
    res.send(error);
  }
};
