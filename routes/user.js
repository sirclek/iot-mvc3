var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/register", user_controller.register_get);
router.post("/register", user_controller.register_post);

router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);

router.get("/logout", user_controller.logout_get);
router.get("/delete", user_controller.delete_get);

router.get("/update", user_controller.update_get);
router.post("/update", user_controller.update_post);

router.get("/logs", user_controller.logs_get);

module.exports = router;
