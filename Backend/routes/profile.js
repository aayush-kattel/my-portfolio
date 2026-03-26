const router  = require("express").Router();
const Profile = require("../models/Profile");
const auth    = require("../middleware/auth");

// helper — always work with single doc (upsert pattern)
async function getProfile() {
  let p = await Profile.findOne();
  if (!p) p = await Profile.create({});
  return p;
}

// GET /api/profile  — public
router.get("/", async (req, res) => {
  try {
    res.json(await getProfile());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/profile  — protected
router.patch("/", auth, async (req, res) => {
  try {
    let p = await getProfile();
    const allowed = ["name","role","location","status","email","github","linkedin","facebook","bio","logoUrl","stats"];
    allowed.forEach(k => { if (req.body[k] !== undefined) p[k] = req.body[k]; });
    await p.save();
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;