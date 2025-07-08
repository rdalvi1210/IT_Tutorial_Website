const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Review", ReviewSchema);
