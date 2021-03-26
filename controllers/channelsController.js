const Channel = require('../models/channel');
const Post = require('../models/post');
const date_options = { year: 'numeric', month: 'long', day: 'numeric' };

exports.renderDashboard = (req, res) => {
  res.render('channels', {
    user: req.user,
  });
};

exports.renderCreateChannelPage = (req, res) => {
  res.render('ch_create.ejs', { user: req.user });
};

exports.createChannel = (req, res) => {
  const channel = new Channel({
    by: req.user._id,
    name: req.body.name,
    description: req.body.description || '',
    private: req.body.private ? true : false,
  });
  channel.save((err, newChannel) => {
    if (err) return console.error(err);
    req.flash(
      'success_msg',
      `Channel: ${newChannel.name} was sucessfully created.`
    );
    res.redirect(`/channels/${newChannel._id}`);
  });
};

exports.renderChannel = (req, res) => {
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
          user: req.user,
          date_options,
        });
      }
    });
};

exports.renderProfileOrDM = (req, res) => {
  if (req.params.userId === req.user._id.toString()) res.redirect('/profile/');
  else {
    Channel.findOne({
      $and: [
        { private: true },
        { members: { $all: [req.user._id, req.params.UserId] } },
      ],
    }).exec((err, channel) => {
      if (err) return console.error(err);
      if (channel) {
        res.redirect(`/channels/${channel._id}`);
      } else {
        const channel = new Channel({
          by: req.user._id,
          name: 'DM_channel',
          description: 'Private DM channel',
          private: true,
          members: [req.user._id, req.params.userId],
        });
        channel.save((err, channel) => {
          if (err) return console.error(err);
          res.redirect(`/channels/${channel._id}`);
        });
      }
    });
  }
};

exports.renderEditPost = (req, res) => {
  Post.findById(req.params.postId)
    .populate('by')
    .exec((err, post) => {
      if (err) return console.error(err);
      res.render('edit_post', {
        post,
        user: req.user,
      });
    });
};

exports.editPost = (req, res) => {
  const newContent = req.body.postContent;
  Post.findByIdAndUpdate(
    { _id: req.params.postId },
    { $set: { content: newContent } }
  ).exec((err, data) => {
    if (err) return console.error(err);
    console.log(data);
    req.flash('success_msg', 'Post sucessfully updated.');
    res.redirect('/channels');
  });
};

exports.deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.postId).exec((err, data) => {
    if (err) return console.error(err);
    console.log(data);
    req.flash('success_msg', 'Post sucessfully deleted.');
    res.redirect('/channels');
  });
};
