const { body, validationResult } = require("express-validator");

const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

//view

exports.view_get = asyncHandler(async function(req, res, next) {

  const products = await Product.find();

  let cartItems = [];

  if (req.session.cart) {
    cartItems = await CartItem.find({ cart_id: req.session.cart._id });
  }

  res.render("cart/view", { title: "View Cart", cartItems: cartItems, products: products,  user: req.session.user});
});