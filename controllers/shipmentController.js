const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const UserLog = require("../models/userLog");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Shipment = require("../models/shipment");

// Create new shipment details
exports.create_get = asyncHandler(async function(req, res, next) {
  res.render("shipment/create", { title: "Add Shipment Details", user: req.session.user });
});

exports.create_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('Please enter first name.'),
  body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Please enter last name.'),
  body('phone_number').trim().isLength({ min: 1 }).escape().withMessage('Please enter phone number.'),
  body('method').trim().isLength({ min: 1 }).escape().withMessage('Shipping method is required.'),
  body('address').trim().isLength({ min: 1 }).escape().withMessage('Address is required.'),
  
  asyncHandler(async function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const prev = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        method: req.body.method,
        address: req.body.address,
      };
      res.render("shipment/create", { title: "Add Shipment Details", prev: prev, user: req.session.user, errors: errors.array() });
      return;
    }

    const shipmentCreate = new Shipment({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      method: req.body.method,
      address: req.body.address,
    });

    const savedShipment = await shipmentCreate.save();
    req.session.shipment = savedShipment;

    res.redirect("/");
    return;
  }),
];

// View shipment details entered
exports.view_get = asyncHandler(async function(req, res, next) {
  const shipment = await Shipment.find();
  res.render("shipment/view", { title: "View Shipment Details", user: req.session.user, shipment: req.session.shipment});
});

// Update shipment
exports.update_get = asyncHandler(async function(req, res, next) {
  let shipment = undefined;

  try {
    shipment = await Shipment.findById(req.params.id);
  } catch (error) {
    shipment = undefined;
  }

  res.render("shipment/update", { title: "Update Shipment", shipment: shipment });
});

exports.update_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('Please enter first name.'),
  body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Please enter last name.'),
  body('phone_number').trim().isLength({ min: 1 }).escape().withMessage('Please enter phone number.'),
  body('method').trim().isLength({ min: 1 }).escape().withMessage('Shipping method is required.'),
  body('address').trim().isLength({ min: 1 }).escape().withMessage('Address is required.'),

  asyncHandler(async function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const prev = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        method: req.body.method,
        address: req.body.address,
      };
      res.render("shipment/update", { title: "Add Shipment Details", prev: prev, user: req.session.user, errors: errors.array() });
      return;
    }

    const shipment = await Shipment.findByIdAndUpdate(req.params.id, {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      method: req.body.method,
      address: req.body.address,
    });

    res.redirect("/");
    return;
  }),
];
