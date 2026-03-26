const router     = require("express").Router();
const Experience = require("../models/Experience");
const auth       = require("../middleware/auth");

router.get("/", async (req, res) => {
  try { res.json(await Experience.find().sort({ order: 1, startDate: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/", auth, async (req, res) => {
  try { res.status(201).json(await Experience.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const doc = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete("/:id", auth, async (req, res) => {
  try { await Experience.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;