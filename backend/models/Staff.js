const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    clinicId:   { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, lowercase: true },
    phone:      { type: String, default: "" },
    role: {
      type: String,
      enum: ["Doctor", "Nurse", "Receptionist", "Pharmacist", "Lab Technician", "Admin"],
      required: true,
    },
    department: { type: String, required: true },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
      default: "Morning",
    },
    qualification: { type: String, default: "" },
    experience:    { type: Number, default: 0 }, // years
    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
