const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentItemsSchema = new Schema({
    cc_no: { type: String, required: true, maxLength: 16, minLength: 15 },
    cc_expiry: { type: String, required: true, maxLength: 5, minLength: 5 },
    cc_cvv: { type: String, required: true, maxLength: 3, minLength: 3 },
});

module.exports = mongoose.model("PaymentItem", PaymentItemsSchema);
