var express = require('express');
var router = express.Router();

const shipmentController = require("../controllers/shipmentController");

// create new shipment details
router.get('/create', shipmentController.create_get);
router.post('/create', shipmentController.create_post);

router.get("/view", shipmentController.view_get);

router.get("/update", shipmentController.update_get);
router.post("/update", shipmentController.update_post);

module.exports = router;
