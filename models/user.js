const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, max: 100,},
    last_name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    role: {type: String, required: true, max: 100},
    encrypted_password: {type: String, required: true, max: 100}
});

module.exports = mongoose.model("User", UserSchema);