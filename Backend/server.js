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
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

/* ── Body parsers ── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Static uploads folder ── */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── Cached Mongoose connection (critical for serverless) ── */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  isConnected = true;
  console.log("✅  MongoDB connected");
}

/* ── DB middleware — ensures connection before every request ── */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌  MongoDB connection error:", err.message);
    res.status(503).json({ error: "Database unavailable. Please try again." });
  }
});

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

/* ── Only listen locally ── */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
}

module.exports = app;