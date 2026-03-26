const router      = require("express").Router();
const jwt         = require("jsonwebtoken");
const auth        = require("../middleware/auth");
const AdminConfig = require("../models/AdminConfig");

// ── Helper: get credential from DB, fall back to .env ──
async function getCred(key, fallback) {
  try {
    const doc = await AdminConfig.findOne({ key });
    return doc ? doc.value : fallback;
  } catch {
    return fallback;
  }
}

// ── Helper: save credential to DB ──
async function setCred(key, value) {
  await AdminConfig.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  // Read from DB (falls back to .env if not set yet)
  const ADMIN_USERNAME = await getCred("ADMIN_USERNAME", process.env.ADMIN_USERNAME || "admin");
  const ADMIN_PASSWORD = await getCred("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD || "admin123");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  res.json({ token, username });
});

// GET /api/auth/verify
router.get("/verify", auth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// PATCH /api/auth/credentials
router.patch("/credentials", auth, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword)
    return res.status(400).json({ error: "Current password is required" });

  // Get current stored password
  const ADMIN_PASSWORD = await getCred("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD || "admin123");

  if (currentPassword !== ADMIN_PASSWORD)
    return res.status(401).json({ error: "Current password is incorrect" });

  if (!newUsername && !newPassword)
    return res.status(400).json({ error: "Provide a new username or password" });

  if (newPassword && newPassword.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  // Save to MongoDB
  if (newUsername) await setCred("ADMIN_USERNAME", newUsername);
  if (newPassword) await setCred("ADMIN_PASSWORD", newPassword);

  res.json({ success: true, message: "Credentials updated. Please log in again." });
});

module.exports = router;
