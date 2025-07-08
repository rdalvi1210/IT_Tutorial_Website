const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
});

// POST /api/courses/addCourse - Add new course with image
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

// Example in Express
router.delete("/delete/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
});

// PUT /api/courses/editCourse/:id - Edit existing course with optional image
router.put("/editCourse/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    const courseId = req.params.id;

    // Check if course exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Update only the fields that are provided in the request
    if (title) existingCourse.title = title;
    if (description) existingCourse.description = description;
    if (duration) existingCourse.duration = duration;
    if (category) existingCourse.category = category;

    // If a new image is uploaded, update imageUrl. Otherwise, retain old one.
    if (req.file && req.file.filename) {
      existingCourse.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await existingCourse.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error. Could not update course." });
  }
});

module.exports = router;

module.exports = router;
