const router = require("express").Router();
const Skill  = require("../models/Skill");
const auth   = require("../middleware/auth");

// GET /api/skills  — public
router.get("/", async (req, res) => {
  try {
    res.json(await Skill.find().sort({ order: 1, createdAt: 1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/skills  — protected
router.post("/", auth, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PATCH /api/skills/:id  — protected
router.patch("/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ error: "Not found" });
    res.json(skill);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/skills/:id  — protected
router.delete("/:id", auth, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;