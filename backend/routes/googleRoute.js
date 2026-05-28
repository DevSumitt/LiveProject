const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const customerAuth = require('../middleware/customer');

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'https://live-project-gold.vercel.app/login'
    }),
    customerAuth, authController.hello
);


module.exports = router;
