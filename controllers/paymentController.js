const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
const User = require("../models/user");

//create

exports.create_get = asyncHandler(async function (req, res, next) {

    res.render("payment/create", { title: "Create Payment", user: req.session.user});
}) 

exports.create_post = asyncHandler(async function (req, res, next) {
    const user = await User.findOne({ email: userEmail });

    if (!req.payment) {
        const newCart = new Cart();
        cart = await newCart.save();
      }
      else {
        console.log(req.session.cart)
        cart = await Cart.findById(req.session.cart._id);
      }
  
      const cartItem = await CartItem.findOne({ cart_id: cart._id, product_id: req.params.id });
  
      if (cartItem) {
        cartItem.quantity += parseInt(req.body.purchase_quantity);
        await cartItem.save();
      }
      else {
        const newCartItem = new CartItem({
          cart_id: cart._id,
          product_id: req.params.id,
          quantity: req.body.purchase_quantity,
        });
        await newCartItem.save();
      }
  
      req.session.cart = cart;
  
      res.redirect("/");
      return;
})