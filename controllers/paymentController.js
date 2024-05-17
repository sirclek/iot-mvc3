//const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Payment = require("../models/payment");


//create

exports.create_get = asyncHandler(async function (req, res, next) {

    res.render("payment/create", { title: "Create Payment", user: req.session.user});
}) 

exports.create_post = asyncHandler(async function (req, res, next) {
    const userEmail = req.session.user.email;

    const newPayment = new Payment({
        user_email: userEmail,
        cc_no: req.body.cc_no,
        cc_expiry: req.body.cc_expiry,
        cc_cvv: req.body.cc_cvv
    });
    

    await newPayment.save();
})