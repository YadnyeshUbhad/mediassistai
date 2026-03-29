const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const patientSchema = new mongoose.Schema(
  {
    patientId:       { type: String, unique: true },
    queueNumber:     { type: Number },
    name:            { type: String, required: true, trim: true },
    age:             { type: Number, required: true },
    gender:          { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone:           { type: String, default: "" },
    address:         { type: String, default: "" },
    email:           { type: String, default: "" },
    bloodGroup:      { type: String, default: "" },
    symptoms:        { type: String, required: true },
    medicalHistory:  { type: String, default: "" },
    allergies:       [{ type: String }],
    department:      { type: String, default: "General" },
    doctorAssigned:  { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    doctorName:      { type: String, default: "" },
    clinicId:        { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
    registeredBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["Waiting", "Consulting", "Completed", "Admitted", "Discharged"],
      default: "Waiting",
    },
  },
  { timestamps: true }
);

// Auto-generate patientId and queueNumber before save
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const suffix = uuidv4().replace(/-/g, "").slice(0, 6).toUpperCase();
    this.patientId = `P-${suffix}`;
  }
  if (!this.queueNumber) {
    const count = await mongoose.model("Patient").countDocuments({ clinicId: this.clinicId });
    this.queueNumber = count + 1;
  }
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
