const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Handover",
  new mongoose.Schema({
    id: String,
    iId: String,
    rId: String
  })
);