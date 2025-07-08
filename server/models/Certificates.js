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
  certificate: {
    type: String, // Path or URL to uploaded PDF
    required: true,
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);
