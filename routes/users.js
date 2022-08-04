const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');

router.get('/register', users.renderRegisterForm);

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.login));

router.get('/logout', users.logout);

module.exports = router;