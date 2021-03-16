const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');
const User = require('../models/user');
const Post = require('../models/post');
const { ensureAuthenticated } = require('../config/auth.js');

const date_options = { year: 'numeric', month: 'long', day: 'numeric' };

//'Home'
router.get('/', ensureAuthenticated, (req, res) => {
  Channel.find((err, channels) => {
    if (err) return console.error(err);
    User.find({ _id: { $ne: req.user._id } }, (err, users) => {
      if (err) return console.error(err);
      //console.log(users);
      res.render('channels', {
        channels: channels,
        user: req.user,
        users: users,
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
  Channel.find((err, data) => {
    if (err) return console.error(err);
    channels = data;
  });
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
          cssdir: '/',
          user: req.user,
          date_options: date_options,
        });
      }
    });
});

router.post('/:id', ensureAuthenticated, (req, res) => {
  User.findOne({ email: req.body.userEmail }).exec((err, user) => {
    if (err) return console.error(err);
    const post = new Post({
      by: user,
      content: req.body.content,
    });
    post.save((err) => {
      if (err) return console.error(err);
      console.log('The following post was created:' + post);
    });
    Channel.updateOne(
      { _id: req.params.id },
      { $push: { posts: post } },
      (err, data) => {
        if (err) return console.error(err);
        res.redirect(`${req.params.id}`);
      }
    );
  });
});
//TODO include _id in html
/* async function PMexixts(firstUserId, secondUserId) {
  const userOne = await Users.findOne({email: firstUserId});
  const userTwo = await Users.findOne({email: secondUserId});
  const privateConv = await Channel.findOne({'members': { "$size" : 2, "$all": [ userOne, userTwo ] }, 'private': true})
  var query = {'members': [userOne, userTwo]},
    update = { expire: new Date() },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
}) */

// Find the document
/* Model.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return;

    // do something with the document
});







  await Users.findOne({
    email: firstUserId
  }).then(res => {
    if (!res) throw 'Invalid first user id.'
    else let userOne = res._id;
  });
  await Users.findOne({
    email: secondUserId
  }).then(res => {
    if (!res) throw 'Invalid second user id.'
    else let userTwo = res._id;
  });
  }).then(res => {
    var result = parse_result(res)
    return codesSchema.findOneAndUpdate({
      used: false,
      user_id: true
    },{
      used: true,
      user_id: mongoose.Types.ObjectId(result._id)
    })
  })
} */

//Start PM route
router.get('/startPM/:PMrecieverEmail', (req, res) => {
  //TODO check if channel exists aleady
  Channel.findOne({ private: true }).exec((err, user) => {
    if (err) return console.error(err);
    res.render('pm_create', {
      cssdir: '/',
      user: req.user,
      PMreciever: req.params.PMrecieverEmail,
    });
  });
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
