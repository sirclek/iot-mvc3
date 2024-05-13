var express = require('express');
var router = express.Router();

const shipmentController = require("../controllers/shipmentController");

// create new shipment details
router.get('/create', shipmentController.create_get);
router.post('/create', shipmentController.create_post);

module.exports = router;
