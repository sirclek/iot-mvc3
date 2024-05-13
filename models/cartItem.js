const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    cart_id: { type: String, required: true, maxlength: 100 },
    product_id: { type: String, required: true, maxlength: 100 },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("CartItem", CartItemSchema);
