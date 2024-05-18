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
exports.addNewPayment_get = asyncHandler(async function (req, res, next) {
    res.render("payment/create", { title: "Add a Payment Method", user: req.session.user});
}); 

exports.addNewPayment_post = [
    // Validate the first name and last name
    body("card_firstName")
        .trim()
        .notEmpty().withMessage("Please enter your first name."),
    body("card_lastName")
        .trim()
        .notEmpty().withMessage("Please enter your last name."),
    
    // Validate the credit card number
    body("cc_no")
        .trim()
        .isLength({ min: 16, max: 16 }).withMessage("Please enter a 16-digit card number.")
        .isNumeric().withMessage("Please enter a valid card number.")
        .custom(async (value, { req }) => {
            const user_id = req.session.user._id;
            const existingPayment = await Payment.findOne({ user_id, cc_no: value });
            if (existingPayment) {
                throw new Error('This card is already registered.');
            }
            return true;
        }),
    body("cc_expiry")
        .trim()
        // .isNumeric().withMessage("Please enter a valid date.")
        .isLength({ min: 5, max: 5 }).withMessage("Please enter a valid expiry date in the format MM/YY.")
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage("Please enter a valid expiry date."),
    body("cc_cvv")
        .trim()
        .isLength({ min: 3, max: 3 }).withMessage("Please enter a 3-digit CVV/CVC.")
        .isNumeric().withMessage("Please enter a valid CVV/CVC."),

    asyncHandler(async function(req, res, next) {
        // Run the validators
        await Promise.all([
            body("card_firstName").run(req),
            body("card_lastName").run(req),
            body("cc_no").run(req),
            body("cc_expiry").run(req),
            body("cc_cvv").run(req),
        ]);

        const errors = validationResult(req);
        const errorFields = errors.array().map(error => error.param);

        // Create a new object that only includes the fields that passed validation
        const validatedInput = Object.keys(req.body)
            .filter(key => !errorFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        if (!errors.isEmpty()) {
            // If there are validation errors, re-render the form with the validated input and the error messages
            res.render("payment/create", { 
                title: "Add a Payment Method", 
                errors: errors.array(),
                errorFields: errorFields,
                input: validatedInput,
                user: req.session.user
            });
            return;
        }
    
        // If there are no validation errors, create a new Payment document and save it to the database
        const payment = new Payment({
            user_id: req.session.user._id,
            card_firstName: req.body.card_firstName,
            card_lastName: req.body.card_lastName,
            cc_no: req.body.cc_no,
            cc_expiry: req.body.cc_expiry,
            cc_cvv: req.body.cc_cvv,
        });

        await payment.save();

        res.redirect("/payment/view"); // Redirect to a success page
        return;
    }),    
];