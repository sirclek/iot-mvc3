var express = require('express');
var router = express.Router();

const cart_controller = require("../controllers/cartController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/view", cart_controller.view_get);

module.exports = router;
