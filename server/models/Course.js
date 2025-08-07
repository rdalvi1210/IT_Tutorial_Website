const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  category: String,
  imageUrl: String,
  imagePublicId: String, // required for deletion from Cloudinary
});

module.exports = mongoose.model("Course", courseSchema);
