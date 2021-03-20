const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { ensureAuthenticated } = require('../config/auth.js');

router.use(express.urlencoded({ extended: true }));

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('profile', {
    user: req.user,
    cssdir: '/',
  });
});

router.post('/', ensureAuthenticated, (req, res) => {
  const userName = req.body.newUserName
  const userEmail = req.body.newUserEmail
  User.updateOne({_id: req.user._id}, { $set: { name: userName, email: userEmail } }).exec((err, data) => {
    if (err) console.log(err)
    console.log('Sucessfully edited user details.');
    res.redirect(`/profile/`);
  })
});

router.post('/uploadPhoto', ensureAuthenticated, (req, res) => {
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
        console.log('Sucessfully uploaded photo.');
        res.redirect(`/profile/`);
      });
    } else {
      res.render('<h1>Err: No file uploaded.</h1>');
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
