const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Certificate = require("../models/Certificates");
const authenticate = require("../middleware/authMiddleware");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../public/certificates");
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

// Multer File Filter (images only)
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

// Multer Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// GET all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// POST - Add certificate
router.post(
  "/addCertificate",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { title, issuer, description, issueDate } = req.body;
    const filePath = req.file ? `/certificates/${req.file.filename}` : null;

    if (!title || !issuer || !description || !issueDate || !filePath) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newCert = new Certificate({
        title,
        issuer,
        description,
        issueDate,
        certificate: filePath,
      });

      const saved = await newCert.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: "Failed to save certificate" });
    }
  }
);

// DELETE certificate and remove image file
router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    // Delete image file from disk
    const fullPath = path.join(__dirname, "../public", cert.certificate);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

// PUT - Edit certificate by ID (with optional image update)
router.put(
  "/editCertificate/:id",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { title, issuer, description, issueDate } = req.body;
    const certId = req.params.id;

    try {
      const existingCert = await Certificate.findById(certId);
      if (!existingCert) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Update text fields if provided
      if (title) existingCert.title = title;
      if (issuer) existingCert.issuer = issuer;
      if (description) existingCert.description = description;
      if (issueDate) existingCert.issueDate = issueDate;

      // If new image uploaded, delete old and update
      if (req.file) {
        if (existingCert.certificate) {
          const oldFilePath = path.join(
            __dirname,
            "../public",
            existingCert.certificate
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        existingCert.certificate = `/certificates/${req.file.filename}`;
      }

      const updatedCert = await existingCert.save();
      res.status(200).json(updatedCert);
    } catch (err) {
      console.error("Error updating certificate:", err);
      res.status(500).json({ error: "Failed to update certificate" });
    }
  }
);

module.exports = router;
