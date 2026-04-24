const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Item",
  new mongoose.Schema({
    id: String,
    itemName: String,
    loc: String,
    date: String,
    mail: String,
    notes: String,
    status: String
  })
);
