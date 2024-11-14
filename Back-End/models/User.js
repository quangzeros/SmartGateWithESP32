// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    default: "out",
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
