require("dotenv").config();
const express       = require("express");
const mongoose      = require("mongoose");
const cors          = require("cors");
const path          = require("path");
const authRoutes    = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const skillRoutes   = require("./routes/skills");
const projectRoutes = require("./routes/projects");
const eduRoutes     = require("./routes/education");
const expRoutes     = require("./routes/experience");
const messageRoutes = require("./routes/messages");
const uploadRoutes  = require("./routes/upload");

const app = express();

/* ── CORS ── */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

/* ── Body parsers ── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Static uploads folder ── */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── Routes ── */
app.use("/api/auth",       authRoutes);
app.use("/api/profile",    profileRoutes);
app.use("/api/skills",     skillRoutes);
app.use("/api/projects",   projectRoutes);
app.use("/api/education",  eduRoutes);
app.use("/api/experience", expRoutes);
app.use("/api/messages",   messageRoutes);
app.use("/api/upload",     uploadRoutes);

/* ── Health check ── */
app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

/* ── Connect DB (outside listen) ── */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB connection error:", err.message));
  // ← removed process.exit(1) — never kill a serverless function

/* ── Only listen locally, not on Vercel ── */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
}

module.exports = app; 