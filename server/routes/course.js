const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set upload directory
const uploadDir = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ================= GET ALL COURSES =================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
});

// ================= ADD COURSE =================
router.post("/addCourse", upload.single("image"), async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !duration || !category || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCourse = new Course({
      title,
      description,
      duration,
      category,
      imageUrl,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ message: "Server error. Could not save course." });
  }
});

// ================= EDIT COURSE =================
router.put("/editCourse/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    const courseId = req.params.id;

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Update fields
    if (title) existingCourse.title = title;
    if (description) existingCourse.description = description;
    if (duration) existingCourse.duration = duration;
    if (category) existingCourse.category = category;

    // Handle image update
    if (req.file && req.file.filename) {
      // Delete old image if it exists
      if (existingCourse.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          existingCourse.imageUrl
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      existingCourse.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await existingCourse.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error. Could not update course." });
  }
});

// ================= DELETE COURSE & IMAGE =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete image file if exists
    if (course.imageUrl) {
      const imagePath = path.join(__dirname, "../public", course.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course" });
  }
});

module.exports = router;
