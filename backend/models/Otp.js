const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mail: String,
  otp: String,
  purpose: String, // post | confirm
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Otp", otpSchema);