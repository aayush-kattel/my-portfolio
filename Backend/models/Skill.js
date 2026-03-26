const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true }, // e.g. Frontend, Backend, Database, DevOps
  color:    { type: String, default: "#5ba898" }, // bubble accent color
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Skill", SkillSchema);