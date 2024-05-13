const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    order_id: { type: String, required: true, maxlength: 100 },
    product_id: { type: String, required: true, maxlength: 100 },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);
