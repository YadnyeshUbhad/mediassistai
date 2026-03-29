const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/auth"));
app.use("/api/clinic",       require("./routes/clinic"));
app.use("/api/staff",        require("./routes/staff"));
app.use("/api/patient",      require("./routes/patient"));
app.use("/api/speech",       require("./routes/speech"));
app.use("/api/agent",        require("./routes/agent"));
app.use("/api/prescription", require("./routes/prescription"));
app.use("/api/reminder",     require("./routes/reminder"));
app.use("/api/ai",           require("./routes/ai"));
app.use("/api/dashboard",    require("./routes/dashboard"));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MedAssist AI Backend is running 🚀", timestamp: new Date() });
});

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─── Database & Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medassist";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB:", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 MedAssist AI Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Nodemon will trigger a restart when files change
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
