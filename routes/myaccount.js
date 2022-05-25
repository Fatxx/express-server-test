const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');

const router = express.Router();

/* GET my account page. */
// This route shows account information of the logged in user.  The route is
// guarded by middleware that ensures a user is logged in.  If not, the web
// browser will be redirected to `/login`.
router.get('/', ensureLoggedIn({ redirectTo: '/' }), (req, res) => {
  res.render('myaccount', {
    title: 'My Account',
    currentUser: req.user,
    signedCookies: JSON.stringify(req.signedCookies, null, 2),
    cookies: JSON.stringify(req.cookies, null, 2),
  });
});

module.exports = router;
