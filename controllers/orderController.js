const { body, validationResult } = require("express-validator");

const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

//create

exports.create_get = asyncHandler(async function(req, res, next) {

    if (!req.session.cart) {
        res.redirect("/");
        return;
    }

    const cartItems = await CartItem.find({ cart_id: req.session.cart._id });

    if (cartItems.length === 0) {
        res.redirect("/");
        return;
    }

    let newOrder = undefined;

    if (req.session.user) {
        newOrder = new Order({
            user_id: req.session.user._id,
        });
    }
    else {
        newOrder = new Order();
    }

    const order = await newOrder.save();

    for (const cartItem of cartItems) {
        const orderItem = new OrderItem({
            order_id: order._id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
        });

        await orderItem.save();
    }

    await CartItem.deleteMany({ cart_id: req.session.cart._id });

    res.render("order/create", { title: "Order Created" });
});