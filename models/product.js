const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: String, required: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
});


module.exports = mongoose.model("Product", ProductSchema);
