const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  category: String,
  imageUrl: String,
});

module.exports = mongoose.model("Course", courseSchema);
