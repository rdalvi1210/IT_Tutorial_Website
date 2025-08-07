const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  certificateUrl: {
    type: String, // Cloudinary secure URL
    required: true,
  },
  certificatePublicId: {
    type: String, // Cloudinary public_id for deletion
    required: true,
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);
