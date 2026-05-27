const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const customerAuth = require('../middleware/customer');

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000/login'
    }),
    customerAuth, authController.hello
);


module.exports = router;