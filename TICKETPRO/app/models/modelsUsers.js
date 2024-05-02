const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  passwordHash: String,
  boughtTickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
