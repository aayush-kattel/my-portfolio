const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: "" },
  stack:       { type: String, default: "" },        // e.g. "MERN"
  tags:        [{ type: String }],                   // array of tech tags
  liveUrl:     { type: String, default: "" },
  githubUrl:   { type: String, default: "" },
  imageUrl:    { type: String, default: "" },
  status:      { type: String, enum: ["Live", "WIP", "Draft", "Archived"], default: "Draft" },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);