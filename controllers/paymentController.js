const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
const User = require("../models/user");

//create

exports.create_get = asyncHandler(async function (req, res, next) {

    res.render("payment/create", { title: "Create Payment", user: req.session.user});
}) 

exports.create_post = asyncHandler(async function (req, res, next) {
    const user = req.session.user;

    const newPayment = new Payment({
        user_id: user.user_id,
        cc_no: req.body.cc_no,
        cc_expiry: req.body.cc_expiry,
        cc_cvv: req.body.cc_cvv
    });

    await newPayment.save();
})