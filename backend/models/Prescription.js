const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  dosage:    { type: String, required: true },
  frequency: { type: String, required: true },
  duration:  { type: String, required: true },
  notes:     { type: String, default: "" },
});

const prescriptionSchema = new mongoose.Schema(
  {
    patientId:     { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName:   { type: String, default: "" },
    doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    doctorName:    { type: String, default: "" },
    clinicId:      { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
    medicines:     [medicineSchema],
    diagnosis:     { type: String, default: "" },
    instructions:  { type: String, default: "Follow the prescribed medication schedule." },
    aiInstructions:{ type: String, default: "" },   // AI-generated patient-friendly instructions
    transcript:    { type: String, default: "" },   // Original speech transcript
    entities:      { type: mongoose.Schema.Types.Mixed, default: {} }, // AI extracted entities
    validationWarnings: [{ type: String }],
    followUpDate:  { type: Date, default: null },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
