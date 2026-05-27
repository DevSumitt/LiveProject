
const passport = require('passport')
const Customer = require("../models/customer");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

passport.serializeUser(async function (user, done) {
  const userEmail = user.emails[0].value;
  const isUser = await Customer.findOne({ Email: userEmail });

  if (!isUser) {
    const saveUser = new Customer({
      Name: user._json.name,
      Email: user._json.email,
      GoogleId: user._json.sub,
    })

    await saveUser.save();
  }

  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
}); 