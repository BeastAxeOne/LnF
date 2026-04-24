const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Qna",
  new mongoose.Schema({
    id: String,
    iId: String,
    q1: String,
    a1: String,
    q2: String,
    a2: String,
    q3: String,
    a3: String
  })
);
