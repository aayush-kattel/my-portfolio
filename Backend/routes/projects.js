const router  = require("express").Router();
const Project = require("../models/Project");
const auth    = require("../middleware/auth");

// GET /api/projects  — public
router.get("/", async (req, res) => {
  try {
    res.json(await Project.find().sort({ order: 1, createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/projects  — protected
router.post("/", auth, async (req, res) => {
  try {
    // tags may come as comma string from forms
    if (typeof req.body.tags === "string")
      req.body.tags = req.body.tags.split(",").map(t => t.trim()).filter(Boolean);
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PATCH /api/projects/:id  — protected
router.patch("/:id", auth, async (req, res) => {
  try {
    if (typeof req.body.tags === "string")
      req.body.tags = req.body.tags.split(",").map(t => t.trim()).filter(Boolean);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/projects/:id  — protected
router.delete("/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;