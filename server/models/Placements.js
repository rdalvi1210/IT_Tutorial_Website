const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    postName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // URL or path to the stored image file
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.model("Placement", placementSchema);

module.exports = Placement;
