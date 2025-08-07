const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificates");
const upload = require("../middleware/cloudinaryMiddleware"); // multer + cloudinary
const cloudinary = require("cloudinary").v2;

// GET all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// POST - Add certificate (Cloudinary)
router.post("/addCertificate", upload.single("image"), async (req, res) => {
  const { title, issuer, description, issueDate } = req.body;

  if (!req.file || !req.file.path || !req.file.filename) {
    return res.status(400).json({ error: "Image upload failed" });
  }

  try {
    const newCert = new Certificate({
      title,
      issuer,
      description,
      issueDate,
      certificateUrl: req.file.path,
      certificatePublicId: req.file.filename, // public_id from Cloudinary
    });

    const saved = await newCert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save certificate" });
  }
});

// DELETE certificate (from DB + Cloudinary)
router.delete("/delete/:id", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    // Delete image from Cloudinary
    if (cert.certificatePublicId) {
      await cloudinary.uploader.destroy(cert.certificatePublicId);
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

// PUT - Edit certificate (optional image update)
router.put("/editCertificate/:id", upload.single("image"), async (req, res) => {
  const { title, issuer, description, issueDate } = req.body;

  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (title) cert.title = title;
    if (issuer) cert.issuer = issuer;
    if (description) cert.description = description;
    if (issueDate) cert.issueDate = issueDate;

    // If new image uploaded, delete old one and update new
    if (req.file && req.file.path && req.file.filename) {
      if (cert.certificatePublicId) {
        await cloudinary.uploader.destroy(cert.certificatePublicId);
      }

      cert.certificateUrl = req.file.path;
      cert.certificatePublicId = req.file.filename;
    }

    const updatedCert = await cert.save();
    res.status(200).json(updatedCert);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update certificate" });
  }
});

module.exports = router;
