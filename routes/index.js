const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.cookie('test', 'value');
  res.render('index', { title: 'Login', currentUser: null });
});

module.exports = router;
