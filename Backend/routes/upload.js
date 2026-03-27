const router                = require("express").Router();
const multer                = require("multer");
const { v2: cloudinary }    = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Profile               = require("../models/Profile");
const auth                  = require("../middleware/auth");

/* ── Configure Cloudinary ── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ─────────────────────────────────────────
   LOGO  —  image upload (jpg/png/webp/gif)
───────────────────────────────────────── */
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "portfolio/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation:  [{ width: 400, height: 400, crop: "limit", quality: "auto" }],
  },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits:  { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

/* ── POST /api/upload/logo — protected ── */
router.post("/logo", auth, uploadLogo.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    let p = await Profile.findOne();

    /* Delete old Cloudinary logo asset if one exists */
    if (p?.logoUrl && p.logoUrl.includes("cloudinary.com")) {
      const segments = p.logoUrl.split("/");
      const filename = segments[segments.length - 1].split(".")[0];
      await cloudinary.uploader
        .destroy(`portfolio/logos/${filename}`)
        .catch(() => {}); // non-fatal
    }

    const logoUrl = req.file.path; // Cloudinary returns full https:// URL
    if (!p) p = await Profile.create({ logoUrl });
    else    { p.logoUrl = logoUrl; await p.save(); }

    res.json({ logoUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ─────────────────────────────────────────
   CV / RESUME  —  PDF upload (raw resource)
───────────────────────────────────────── */
const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:        "portfolio/cv",
    resource_type: "raw",           // required for non-image files like PDF
    public_id:     "resume",        // always overwrite with same public_id
    format:        "pdf",
  }),
});

const uploadCV = multer({
  storage: cvStorage,
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

/* ── POST /api/upload/cv — protected ── */
router.post("/cv", auth, uploadCV.single("cv"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    let p = await Profile.findOne();

    // Append fl_attachment so browsers always download instead of previewing
    const rawUrl = req.file.path;
    const cvUrl  = rawUrl.includes("?")
      ? rawUrl + "&fl_attachment=Resume.pdf"
      : rawUrl + "?fl_attachment=Resume.pdf";

    if (!p) p = await Profile.create({ cvUrl });
    else    { p.cvUrl = cvUrl; await p.save(); }

    res.json({ cvUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── DELETE /api/upload/cv — protected ── */
router.delete("/cv", auth, async (req, res) => {
  try {
    const p = await Profile.findOne();
    if (!p || !p.cvUrl) return res.status(404).json({ error: "No CV found" });

    // Destroy raw asset from Cloudinary
    await cloudinary.uploader
      .destroy("portfolio/cv/resume", { resource_type: "raw" })
      .catch(() => {});

    p.cvUrl = "";
    await p.save();
    res.json({ message: "CV deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const projectImgStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 800, height: 500, crop: "limit", quality: "auto" }],
  },
});

const uploadProjectImg = multer({
  storage: projectImgStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
});

router.post("/project-image", auth, uploadProjectImg.single("projectImage"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ imageUrl: req.file.path });
});

module.exports = router;