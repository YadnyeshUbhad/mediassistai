const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const Reminder = require("../models/Reminder");
const { generateSchedule } = require("../services/reminderService");

// ── POST /api/prescription/create ─────────────────────────────────────────────
exports.createPrescription = async (req, res) => {
  try {
    const {
      patientId, doctorId, doctorName, medicines,
      diagnosis, instructions, aiInstructions,
      transcript, entities, validationWarnings, followUpDate,
      autoCreateReminders,
    } = req.body;

    if (!patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: "Patient ID and at least one medicine are required." });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    const clinicId = req.user.clinicId || patient.clinicId;

    const prescription = await Prescription.create({
      patientId,
      patientName: patient.name,
      doctorId: doctorId || null,
      doctorName: doctorName || req.user.name || "",
      clinicId,
      medicines,
      diagnosis: diagnosis || "",
      instructions: instructions || "",
      aiInstructions: aiInstructions || "",
      transcript: transcript || "",
      entities: entities || {},
      validationWarnings: validationWarnings || [],
      followUpDate: followUpDate || null,
    });

    // Update patient status to Completed
    await Patient.findByIdAndUpdate(patientId, { status: "Completed" });

    // Auto-create reminders if requested
    if (autoCreateReminders && medicines.length > 0) {
      const reminderPromises = medicines.map((med) =>
        Reminder.create({
          patientId,
          prescriptionId: prescription._id,
          medicine: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          schedule: generateSchedule(med.frequency),
          notes: med.notes || "",
        })
      );
      await Promise.all(reminderPromises);
    }

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (err) {
    console.error("Create prescription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/prescription/:patientId ──────────────────────────────────────────
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId, isActive: true })
      .sort({ createdAt: -1 })
      .populate("patientId", "name patientId age")
      .populate("clinicId", "name");

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/prescription/clinic/all ──────────────────────────────────────────
exports.getClinicPrescriptions = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [prescriptions, total] = await Promise.all([
      Prescription.find({ clinicId, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("patientId", "name patientId age gender"),
      Prescription.countDocuments({ clinicId, isActive: true }),
    ]);

    res.json({ success: true, count: prescriptions.length, total, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/prescription/single/:id ──────────────────────────────────────────
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patientId", "name patientId age gender phone")
      .populate("clinicId", "name address phone");
    
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found." });
    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
