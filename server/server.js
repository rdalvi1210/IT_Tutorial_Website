const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = ["http://localhost:5173"]; // Frontend URL (React app URL)

app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true, // ✅ important for sending cookies
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser()); // required to read cookies

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"), {
    maxAge: "30d", // cache images for 30 days
  })
);

app.use(
  "/placements",
  express.static(path.join(__dirname, "public/placements"), {
    maxAge: "30d", // cache images for 30 days
  })
);

app.use(
  "/certificates",
  express.static(path.join(__dirname, "public/certificates"), {
    maxAge: "30d", // cache images for 30 days
  })
);

app.use(
  "/banners",
  express.static(path.join(__dirname, "public/banners"), {
    maxAge: "30d", // cache images for 30 days
  })
);

// API Routes
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/certificates", require("./routes/certificates"));
app.use("/api/placements", require("./routes/placements"));
app.use("/api/banners", require("./routes/banner"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
