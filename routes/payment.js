var express = require('express');
var router = express.Router();

const payment_controller = require("../controllers/paymentController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/create", paymentController.create_get);
router.post('/create', paymentController.create_post);

module.exports = router;



