const express = require('express');
const passport = require('passport');
const db = require('../db');
const { setPassword } = require('../utils/hashPassword');

const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { assignProperty: 'federatedUser', failureRedirect: '/login', scope: ['email'] }),
  (req, res, next) => {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      'https://www.facebook.com',
      req.federatedUser.id,
    ], (err, currentFederatedUser) => {
      if (err) { return next(err); }
      if (!currentFederatedUser?.user_id) {
        db.run('INSERT INTO users (name) VALUES (?)', [
          req.federatedUser.displayName,
        ], function (err) {
          const newUser = this;
          if (err) { return next(err); }

          const id = newUser.lastID;
          db.run('INSERT INTO federated_credentials (provider, subject, user_id) VALUES (?, ?, ?)', [
            'https://www.facebook.com',
            req.federatedUser.id,
            id,
          ], (err) => {
            if (err) { return next(err); }
            const user = {
              id: id.toString(),
              name: req.federatedUser.displayName,
            };
            req.login(user, (err) => {
              if (err) { return next(err); }
              res.redirect('/myaccount');
            });
          });
        });
      } else {
        db.get('SELECT rowid, email, name FROM users WHERE rowid = ?', [currentFederatedUser.user_id], (err, currentUser) => {
          if (err) { return next(err); }

          const loggedUser = {
            id: currentUser.rowid,
            name: currentUser.name,
          };

          req.login(loggedUser, (err) => {
            if (err) { return next(err); }
            res.redirect('/myaccount');
          });
        });
      }
    });
  },
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/register', (req, res, next) => {
  if (req.user) {
    return res.redirect('/myaccount');
  }

  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.redirect('/', { error: 'Missing email, password or name' });
  }

  db.run('INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)', [
    req.body.name,
    req.body.email,
    setPassword(req.body.password),
  ], function (err) {
    if (err) { return next(err); }
    const user = {
      id: this.lastID,
      name: req.body.name,
    };
    req.login(user, (err) => {
      if (err) { return next(err); }
      res.redirect('/myaccount');
    });
  });
});

router.post(
  '/login',
  passport.authenticate(
    'local',
    { failureRedirect: '/' },
  ),
  (req, res) => res.redirect('/myaccount'),
);

module.exports = router;
