var express = require('express');
var router = express.Router();

const product_controller = require("../controllers/productController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/create", product_controller.create_get);
router.post("/create", product_controller.create_post);

router.get("/view", product_controller.view_get);
router.get("/view/:id", product_controller.view_detail_get);
router.post("/view/:id", product_controller.view_detail_post);

router.get("/update/:id", product_controller.update_get);
router.post("/update/:id", product_controller.update_post);

router.get("/search", product_controller.search_get);

router.get("/added", product_controller.added_get);



module.exports = router;
