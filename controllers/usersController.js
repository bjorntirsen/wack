const multer = require('multer');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { storage } = require('./cloudinary');
const parser = multer({ storage });

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

exports.uploadPhoto = parser.single('profile_pic');

exports.afterUpload = catchAsync(async (req, res) => {
  const data = { profilePhoto: req.file.path };
  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    console.log(error);
    res.send(error);
  }
  req.flash('success_msg', 'Sucessfully uploaded photo.');
  res.redirect(`/users/profile/`);
});
