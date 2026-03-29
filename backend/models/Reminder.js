const mongoose = require("mongoose");

const scheduleEntrySchema = new mongoose.Schema({
  time:     { type: String, required: true }, // e.g. "08:00 AM"
  label:    { type: String, required: true }, // e.g. "Morning"
  medicine: { type: String, required: true },
  dosage:   { type: String, default: "" },
  taken:    { type: Boolean, default: false },
});

const reminderSchema = new mongoose.Schema(
  {
    patientId:      { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", default: null },
    medicine:       { type: String, required: true },
    dosage:         { type: String, default: "" },
    frequency:      { type: String, required: true }, // "Once daily", "Twice daily", etc.
    duration:       { type: String, required: true }, // "5 days", "30 days", etc.
    schedule: [scheduleEntrySchema],
    startDate:      { type: Date, default: Date.now },
    endDate:        { type: Date },
    isActive:       { type: Boolean, default: true },
    notes:          { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
