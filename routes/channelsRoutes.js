const express = require('express');
const router = express.Router();
const channelsController = require('./../controllers/channelsController');
const { ensureAuthenticated } = require('../controllers/authController');

router.get('/', ensureAuthenticated, channelsController.renderDashboard);

router
  .route('/create')
  .get(ensureAuthenticated, channelsController.renderCreateChannelPage)
  .post(ensureAuthenticated, channelsController.createChannel);

router.get('/:id', ensureAuthenticated, channelsController.renderChannel);

router.get(
  '/DMorProfile/:userId',
  ensureAuthenticated,
  channelsController.renderProfileOrDM
);

router
  .route('/editPost/:channelId/:postId')
  .get(ensureAuthenticated, channelsController.renderEditPost)
  .post(ensureAuthenticated, channelsController.editPost);

router.get(
  '/deletePost/:channelId/:postId',
  ensureAuthenticated,
  channelsController.deletePost
);

module.exports = router;
