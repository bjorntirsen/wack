const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { ensureAuthenticated } = require('../controllers/authController');

router.use(express.urlencoded({ extended: true }));

router.post('/register', usersController.handleRegister);

router.post('/signin', usersController.handleSignIn);

router.get('/signout', usersController.handleSignOut);

router
  .route('/profile')
  .get(ensureAuthenticated, usersController.renderProfile)
  .post(ensureAuthenticated, usersController.changeNameOrEmail);

router.post(
  '/profile/uploadPhoto',
  ensureAuthenticated,
  usersController.uploadPhoto
);

module.exports = router;
