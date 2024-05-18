const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user_id: { type: String, maxlength: 100 },
    card_name: { type: String, required: true, maxlength: 100 },
    cc_no: { type: String, required: true, maxLength: 16, minLength: 15 },
    cc_expiry: { type: String, required: true, maxLength: 5, minLength: 5 },
    cc_cvv: { type: String, required: true, maxLength: 3, minLength: 3 }
});

module.exports = mongoose.model("Payment", PaymentSchema);
