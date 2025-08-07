const express = require("express");
const router = express.Router();
const Placement = require("../models/Placements");
const upload = require("../middleware/cloudinaryMiddleware");
const cloudinary = require("cloudinary").v2;

// ================= GET All Placements =================
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch placements" });
  }
});

// ================= ADD Placement =================
router.post("/addPlacement", upload.single("image"), async (req, res) => {
  try {
    const { name, companyName, postName } = req.body;

    if (!name || !companyName || !postName || !req.file) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newPlacement = new Placement({
      name,
      companyName,
      postName,
      imageUrl: req.file.path, // Cloudinary secure URL
      imagePublicId: req.file.filename, // Cloudinary public_id
    });

    const saved = await newPlacement.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving placement:", err);
    res.status(500).json({ error: "Failed to save placement" });
  }
});

// ================= DELETE Placement =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    if (placement.imagePublicId) {
      await cloudinary.uploader.destroy(placement.imagePublicId);
    }

    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: "Placement deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete placement" });
  }
});

// ================= EDIT Placement =================
router.put("/editPlacement/:id", upload.single("image"), async (req, res) => {
  const { name, companyName, postName } = req.body;

  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    if (name) placement.name = name;
    if (companyName) placement.companyName = companyName;
    if (postName) placement.postName = postName;

    if (req.file) {
      // Remove old image from Cloudinary
      if (placement.imagePublicId) {
        await cloudinary.uploader.destroy(placement.imagePublicId);
      }

      placement.imageUrl = req.file.path;
      placement.imagePublicId = req.file.filename;
    }

    const updatedPlacement = await placement.save();
    res.status(200).json(updatedPlacement);
  } catch (err) {
    console.error("Error updating placement:", err);
    res.status(500).json({ error: "Failed to update placement" });
  }
});

module.exports = router;
