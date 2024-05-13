const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const UserLog = require("../models/userLog");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

//register

exports.register_get = asyncHandler(async function(req, res, next) {
  res.render("user/register", { title: "Register" , user: req.session.user});
});

exports.register_post = [
  body("first_name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Please enter a first name."),
  body("last_name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Please enter a last name."),
  body("email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("Please enter an email with the correct formatting.")
  .custom(async (value) => {
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
      throw new Error("Email is already associated with another account. Please choose a different email");
    }
    return true;
  }),
  body("password")
  .isLength({ min: 8 })
  .withMessage("Please enter a password that is at least 8 characters long."),
  body("confirm_password")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

      const prev = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      };
      res.render("user/register", { title: "Register", prev: prev, errors: errors.array() });
      return;
    }

    const salt = "$2b$10$cLgGnlfc3F2mhO8BbgRrVe";
    const encrypted_password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      role: req.body.role,
      encrypted_password: encrypted_password,
    });

    const savedUser = await user.save();

    req.session.user = savedUser;

    const log = new UserLog({
      user_id: savedUser._id,
      action: "Registered",
    });

    const cart = new Cart( { user_id: savedUser._id });
    const newCart = await cart.save();

    req.session.cart = newCart;

    log.save();

    res.redirect("/");
    return;
  }),
];

//login

exports.login_get = asyncHandler(async function(req, res, next) {
  res.render("user/login", { title: "Login" , user: req.session.user});
});

exports.login_post = [
  body("email")
  .custom(async (value, { req }) => {
    const existingUser = await User.findOne({ email: value });
    if (!existingUser) {
      throw new Error("No account associated with this email");
    }
    const salt = "$2b$10$cLgGnlfc3F2mhO8BbgRrVe";
    const encrypted_password = await bcrypt.hash(req.body.password, salt);
    if (encrypted_password !== existingUser.encrypted_password) {
      throw new Error("Incorrect password");
    }
    return true;
  }),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);


    if(!errors.isEmpty()) {

      const prev = {
        email: req.body.email,
        password: req.body.password,
      };
      res.render("user/login", { title: "Login", prev: prev, errors: errors.array() });
      return;
    }

    req.session.user = await User.findOne({ email: req.body.email });

    const log = new UserLog({
      user_id: req.session.user._id,
      action: "Logged In",
    });

    log.save();

    const cart = await Cart.findOne({ user_id: req.session.user._id });

    if (cart) {
      req.session.cart = cart;

      req.session.cartItems = []

      const dbCartItems = await CartItem.find({ cart_id: req.session.cart._id })

      if (dbCartItems) {
        req.session.cartItems = dbCartItems
      }
    }

    console.log(req.session.cart)
    console.log(req.session.cartItems)

    res.redirect("/");
    return;
  }),
];

//logout

exports.logout_get = asyncHandler(async function(req, res, next) {

  if (req.session.user) {
    const log = new UserLog({
      user_id: req.session.user._id,
      action: "Logged Out",
    });

    log.save();
  }

  req.session.user = undefined;
  cart = undefined;
  cartItems = undefined;
  res.render("user/logout", { title: "Logout"});
});

//delete

exports.delete_get = asyncHandler(async function(req, res, next) {

  if (req.session.user) {
    const userDB = await User.findOneAndDelete({ email: req.session.user._id });

    const log = new UserLog({
      user_id: userDB._id,
      action: "Deleted Account",
    });

    user = req.session.user;
    req.session.user = undefined;
  }
  res.render("user/delete", { title: "Delete" , user: req.user});
});

//update

exports.update_get = asyncHandler(async function(req, res, next) {
  res.render("user/update", { title: "Update" , user: req.session.user});
});

exports.update_post = [
  body("email")
  .custom(async (value, { req }) => {
    const existingUser = await User.findOne({ email: value });
    if (value !== req.session.user.email && existingUser) {
      throw new Error("Email belongs to another account");
    }
    return true;
  }),

  asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {

      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.session.user.role,
        password: req.body.password,
      };
      res.render("user/update", { title: "Update", user: user, errors: errors.array() });
      return;
    }

    const salt = "$2b$10$cLgGnlfc3F2mhO8BbgRrVe";
    const encrypted_password = await bcrypt.hash(req.body.password, salt);

    req.session.user = await User.findOneAndUpdate(
      { email: req.session.user.email },
      { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, role: req.session.user.role, password: encrypted_password},
      { new: true }
      );

    const log = new UserLog({
      user_id: req.session.user._id,
      action: "Updated Account",
    });

    res.redirect("/");
    return;
  }),
];

//view logs

exports.logs_get = asyncHandler(async function(req, res, next) {

  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  const logs = await UserLog.find({ user_id: req.session.user._id }); 

  res.render("user/logs", { title: "Logs" , user: req.session.user, logs: logs});
});