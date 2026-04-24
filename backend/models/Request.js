const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Request",
  new mongoose.Schema({
    id: String,
    iId: String,
    mail: String,
    status: {
      type: String,
      default: "pending"
    }
  })
);
