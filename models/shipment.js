const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
    order_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    address: { type: String, required: true },
    method: { type: String, required: true },
    date: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model("Shipment", ShipmentSchema);
