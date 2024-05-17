const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Payment = require("../models/payment");

// View all payment methods
exports.viewAllMethods = asyncHandler(async function (req, res, next) {
    // Fetch the id of the current user from the session
    const userId = req.session.user._id;

    // Fetch all payment methods tied to the current user from the database
    let paymentMethods = await Payment.find({ user_id: userId });
    
    // Extract card numbers from the payment methods
    let cardNumbers = paymentMethods.map(paymentMethod => paymentMethod.cc_no);

    // Render the view with the fetched payment methods and card numbers
    res.render("payment/view", { title: "Your Payments", paymentMethods: paymentMethods, cardNumbers: cardNumbers, user: req.session.user});
});

// Add a new payment method
// exports.addNewPayment_get = asyncHandler(async function (req, res, next) {
//     res.render("payment/create", { title: "Add a Payment Method", user: req.session.user});
// }); 

// exports.addNewPayment_post = asyncHandler(async function (req, res, next) {
//     const userEmail = req.session.user.email;

//     const newPayment = new Payment({
//         user_email: userEmail,
//         cc_no: req.body.cc_no,
//         cc_expiry: req.body.cc_expiry,
//         cc_cvv: req.body.cc_cvv
//     });
    

//     await newPayment.save();
// })