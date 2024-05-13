const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: { type: String, maxlength: 100 },
});

module.exports = mongoose.model("Cart", CartSchema);
