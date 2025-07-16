const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Banner = require("../models/Banner");

// Ensure banner upload directory exists
const uploadDir = path.join(__dirname, "../public/banners");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Multer file filter (image only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// ======================= GET ALL BANNERS =======================
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});

// ======================= ADD BANNER =======================
router.post("/addBanner", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/banners/${req.file.filename}`;
    const banner = new Banner({ imageUrl });

    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save banner" });
  }
});

// ======================= DELETE BANNER =======================
router.delete("/delete/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const filePath = path.join(__dirname, "../public", banner.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner" });
  }
});

// ======================= UPDATE BANNER =======================
router.put("/editBanner/:id", upload.single("image"), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (req.file) {
      // Delete old file
      if (banner.imageUrl) {
        const oldFilePath = path.join(__dirname, "../public", banner.imageUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      banner.imageUrl = `/banners/${req.file.filename}`;
    }

    const updated = await banner.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ message: "Failed to update banner" });
  }
});

module.exports = router;
