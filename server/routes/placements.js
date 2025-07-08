const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Placement = require("../models/Placements"); // or rename to Placements if needed

// Upload directory path
const uploadDir = path.join(__dirname, "../public/placements");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File Filter - only image files allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Only image files (jpeg, jpg, png, gif) are allowed");
  }
};

// Multer Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// GET all placements
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch placements" });
  }
});

// POST - Add placement
router.post("/addPlacement", upload.single("image"), async (req, res) => {
  const { name, companyName, postName } = req.body;
  const filePath = req.file ? `/placements/${req.file.filename}` : null;

  if (!name || !companyName || !postName || !filePath) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newPlacement = new Placement({
      name,
      companyName,
      postName,
      imageUrl: filePath,
    });

    const saved = await newPlacement.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save placement" });
  }
});

// DELETE placement
router.delete("/delete/:id", async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement)
      return res.status(404).json({ error: "Placement not found" });

    const fullPath = path.join(__dirname, "..", placement.imageUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: "Placement deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete placement" });
  }
});

// PUT - Edit placement by ID
router.put("/editPlacement/:id", upload.single("image"), async (req, res) => {
  const { name, companyName, postName } = req.body;
  const placementId = req.params.id;

  try {
    const existingPlacement = await Placement.findById(placementId);
    if (!existingPlacement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    // Update fields if provided
    if (name) existingPlacement.name = name;
    if (companyName) existingPlacement.companyName = companyName;
    if (postName) existingPlacement.postName = postName;
    if (req.file) {
      existingPlacement.imageUrl = `/placements/${req.file.filename}`;
    }

    const updatedPlacement = await existingPlacement.save();
    res.status(200).json(updatedPlacement);
  } catch (err) {
    console.error("Error updating placement:", err);
    res.status(500).json({ error: "Failed to update placement" });
  }
});

module.exports = router;
