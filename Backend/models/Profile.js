const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name:     { type: String, default: "" },
    role:     { type: String, default: "" },
    bio:      { type: String, default: "" },
    location: { type: String, default: "" },
    status:   { type: String, default: "" },
    email:    { type: String, default: "" },
    github:   { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    logoUrl:  { type: String, default: "" },

    /* ── CV / Resume ── */
    cvUrl:    { type: String, default: "" },

    stats: {
      totalProjects: { type: String, default: "" },
      profileViews:  { type: String, default: "" },
      skillsListed:  { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);