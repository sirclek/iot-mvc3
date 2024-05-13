var express = require('express');
var router = express.Router();

const order_controller = require("../controllers/orderController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/create", order_controller.create_get);

module.exports = router;
