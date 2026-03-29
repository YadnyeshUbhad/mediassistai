const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    address:     { type: String, required: true },
    city:        { type: String, default: "" },
    phone:       { type: String, default: "" },
    email:       { type: String, default: "" },
    ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    departments: [{ type: String }],
    isActive:    { type: Boolean, default: true },
    logo:        { type: String, default: "" },
    licenseNo:   { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clinic", clinicSchema);
