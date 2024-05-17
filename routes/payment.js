var express = require('express');
var router = express.Router();

const paymentController = require("../controllers/paymentController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/view", paymentController.viewAllMethods);
// router.get("/create", paymentController.addNewPayment_get);
// router.post('/create', paymentController.addNewPayment_post);


module.exports = router;



