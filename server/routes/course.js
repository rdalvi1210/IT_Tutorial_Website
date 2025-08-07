const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const upload = require("../middleware/cloudinaryMiddleware");
const cloudinary = require("cloudinary").v2;

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

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const newCourse = new Course({
      title,
      description,
      duration,
      category,
      imageUrl: req.file.path, // Cloudinary secure URL
      imagePublicId: req.file.filename, // Cloudinary public_id
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Server error. Could not save course." });
  }
});

// ================= EDIT COURSE =================
router.put("/editCourse/:id", upload.single("image"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const { title, description, duration, category } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.category = category || course.category;

    if (req.file) {
      // Delete old image from Cloudinary
      if (course.imagePublicId) {
        await cloudinary.uploader.destroy(course.imagePublicId);
      }

      // Set new image
      course.imageUrl = req.file.path;
      course.imagePublicId = req.file.filename;
    }

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error editing course:", error);
    res.status(500).json({ message: "Could not update course." });
  }
});

// ================= DELETE COURSE =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete image from Cloudinary
    if (course.imagePublicId) {
      await cloudinary.uploader.destroy(course.imagePublicId);
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

module.exports = router;
