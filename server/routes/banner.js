const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const upload = require("../middleware/cloudinaryMiddleware");
const cloudinary = require("cloudinary").v2;

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

    const imageUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.filename; // Cloudinary public_id

    const banner = new Banner({ imageUrl, cloudinaryPublicId: publicId });

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

    // Delete image from Cloudinary
    if (banner.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(banner.cloudinaryPublicId);
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
      // Delete old image from Cloudinary
      if (banner.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(banner.cloudinaryPublicId);
      }

      banner.imageUrl = req.file.path; // New Cloudinary URL
      banner.cloudinaryPublicId = req.file.filename; // New public_id
    }

    const updated = await banner.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ message: "Failed to update banner" });
  }
});

module.exports = router;
