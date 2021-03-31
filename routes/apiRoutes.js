const express = require('express');

const router = express.Router();
router.use(express.json());
const { ensureAuthenticated } = require('../controllers/authController');
const apiController = require('../controllers/apiController');

router
  .route('/channels/:id')
  .post(ensureAuthenticated, apiController.createPost);

router
  .route('/channels')
  .get(ensureAuthenticated, apiController.getAllPublicChannels);

router.route('/users').get(ensureAuthenticated, apiController.getAllUsers);

module.exports = router;
