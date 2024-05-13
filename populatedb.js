#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const User = require("./models/user");

const users = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
console.log("Debug: About to connect");
await mongoose.connect(mongoDB);
console.log("Debug: Should be connected?");
await createUsers();
console.log("Debug: Closing mongoose");
mongoose.connection.close();
}

async function userCreate(first_name, last_name, email, encrypted_password) {
const user = new User({
    first_name: first_name,
    last_name: last_name,
    email: email,
    encrypted_password: encrypted_password
});
await user.save();
users.push(user);
console.log(`Added user: ${first_name} ${last_name}`);
}

async function createUsers() {
console.log("Adding users");
await Promise.all([
    userCreate("John", "Doe", "john@example.com", "hashed_password_1"),
    userCreate("Jane", "Smith", "jane@example.com", "hashed_password_2"),
    userCreate("Alice", "Johnson", "alice@example.com", "hashed_password_3"),
]);
}