const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserLogSchema = new Schema({
    user_id: {type: String, required: true, max: 100,},
    action: {type: String, required: true, max: 100},
    date: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model("UserLog", UserLogSchema);