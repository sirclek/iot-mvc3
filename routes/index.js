var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", { title: "Home | IoTBay" , user: req.session.user, activePage: 'home'});

});

module.exports = router;
