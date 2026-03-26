const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, default: "" },
  type:        { type: String, default: "Full-time" }, // Full-time, Part-time, Freelance, Internship
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: "Present" },
  description: { type: String, default: "" },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Experience", ExperienceSchema);