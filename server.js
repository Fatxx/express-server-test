const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');
const flash = require('connect-flash');

require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const myaccountRouter = require('./routes/myaccount');

const app = express();

require('./boot/db')();
require('./boot/auth')();

// eslint-disable-next-line no-underscore-dangle
app.engine('.html', require('ejs').__express);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(flash());

// session setup
//
// This sequence of middleware is necessary for login sessions.  The first
// middleware loads session data and makes it available at `req.session`.  The
// next lines initialize Passport and authenticate the request based on session
// data.  If session data contains a logged in user, the user is set at
// `req.user`.
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/myaccount', myaccountRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server listening on port ${port}`);
});
