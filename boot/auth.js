const passport = require('passport');
const Strategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
const { validPassword } = require('../utils/hashPassword');
const db = require('../db');

module.exports = function () {
  // Configure the Facebook strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Facebook API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(new Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      state: true,
    },
    ((accessToken, refreshToken, profile, cb) => cb(null, profile)),
  ));

  passport.use(new LocalStrategy(
    (username, password, done) => {
      db.get('SELECT rowid, email, name, hashed_password FROM users WHERE email = ?', [username], (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!validPassword(password, user.hashed_password)) { return done(null, false); }
        const loggedUser = {
          id: user.rowid,
          name: user.name,
        };
        return done(null, loggedUser);
      });
    },
  ));

  // Configure Passport authenticated session persistence.
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
};
