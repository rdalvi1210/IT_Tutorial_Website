const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config for uploading any image size and common formats
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kaivalyainfotech",
    resource_type: "image", // makes sure only images are allowed
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
      "ico",
    ],
    // No transformation applied to preserve original size
  },
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
