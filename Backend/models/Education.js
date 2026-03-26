const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  degree:      { type: String, required: true },
  institution: { type: String, required: true },
  location:    { type: String, default: "" },
  startYear:   { type: String, required: true },
  endYear:     { type: String, default: "Present" },
  description: { type: String, default: "" },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Education", EducationSchema);