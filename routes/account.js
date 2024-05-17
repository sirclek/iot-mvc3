// FILE: account.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    // If the user is not logged in, redirect to the login page
    res.redirect('/user/login');
  } else {
    // If the user is logged in, render the account page
    res.render('account', { title: "Account | IoTBay", user: req.session.user, activePage: 'account' });
  }
});

module.exports = router;