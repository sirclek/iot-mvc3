const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const UserLog = require("../models/userLog");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Shipment = require("../models/shipment")

// create new shipment details

exports.create_get = asyncHandler(async function(req, res, next) {

  res.render("shipment/create", { title: "Add Shipment Details",  user: req.session.user});

});

exports.create_post = [

  asyncHandler(async function(req, res, next) {

    const shipmentCreate = new Shipment({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      order_id: req.session.order._id,
      method: req.body.method,
      address: req.body.address,
    });

    const shipment = await shipmentCreate.save();

    res.redirect("/");
    return;
  }),
];